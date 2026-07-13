"use strict";

// dom-элементы
const cinemaHall = document.querySelector(".cinema__hall");
const movieSelect = document.querySelector("#movie-select");
const selectedSeatsCount = document.querySelector("#selected-seat-count");
const totalPrice = document.querySelector("#total-price");
const reserveBtn = document.querySelector(".reservation__button");

// Глобальное состояние
let cinemaData;
let movies;

// Функции проверки
function isFreeSeat(element) {
	return element.classList.contains("seat--free");
}

// Функции получения
function getSelectedSeats() {
	const seats = document.querySelectorAll(".cinema__hall .seat--selected");

	return seats;
}

function getSeatPosition(seat) {
	return {
		groupIndex: seat.parentElement.dataset.groupIndex,
		seatIndex: seat.dataset.seatIndex,
	};
}

function getMovieSelectId() {
	const options = movieSelect.options;
	const selectedIndex = movieSelect.selectedIndex;

	return options[selectedIndex].id;
}

// Функции создания
function createMovieOption(movie) {
	const option = document.createElement("option");
	option.id = movie.id;
	option.value = movie.price;
	option.textContent = movie.title;

	return option;
}

function createCinemaSeat(status, index) {
	const seat = document.createElement("div");
	seat.classList.add("seat");
	seat.classList.add(`seat--${status}`);
	seat.dataset.seatIndex = index;

	return seat;
}

function createCinemaGroup({ columnsCount, seats }, index) {
	const group = document.createElement("div");
	group.classList.add("cinema__group");
	group.classList.add(`cinema__group--cols${columnsCount}`);
	group.dataset.groupIndex = index;

	seats.forEach((seat, index) => {
		const seatElement = createCinemaSeat(seat.status, index);
		group.append(seatElement);
	});

	return group;
}

// Функции переключения состояния
function toggleSelectedSeat(seat) {
	seat.classList.toggle("seat--selected");
}

function toggleReserveBtn(isEmpty) {
	if (isEmpty) {
		reserveBtn.classList.add("reservation__button--inactive");
		reserveBtn.disabled = true;
	} else {
		reserveBtn.classList.remove("reservation__button--inactive");
		reserveBtn.disabled = false;
	}
}

async function toggleCinemaHall() {
	const id = getMovieSelectId();
	await getCinemaDataAsync(id);
	renderCinemaHall();
}

// Функции обновления состояния
function updateReceipt(count) {
	selectedSeatsCount.textContent = count;
	totalPrice.textContent = count * Number(movieSelect.value);
}

function updateReservationState() {
	const seats = getSelectedSeats();
	const count = seats.length;
	updateReceipt(count);

	const isEmpty = !count;
	toggleReserveBtn(isEmpty);
}

// Функции рендера
function renderMoviesOptions() {
	movies.forEach((movie) => {
		const movieOption = createMovieOption(movie);
		movieSelect.append(movieOption);
	});
}

function renderCinemaHall() {
	cinemaHall.innerHTML = "";
	cinemaData.hall.forEach((group, index) => {
		const groupElement = createCinemaGroup(group, index);
		cinemaHall.append(groupElement);
	});
}

// Функции бронирования
function reserveSeat(groupIndex, seatIndex) {
	cinemaData.hall[groupIndex].seats[seatIndex].status = "occupied";
}

async function reserveSelectedSeats() {
	const seats = getSelectedSeats();
	seats.forEach((seat) => {
		const { groupIndex, seatIndex } = getSeatPosition(seat);
		reserveSeat(groupIndex, seatIndex);
	});

	await updateCinemaDateAsync();
	renderCinemaHall();
}

// Асинхронные функции
async function getMoviesAsync() {
	try {
		const url = "http://localhost:3000/movies";
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		movies = await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

async function getCinemaDataAsync(id) {
	try {
		const url = `http://localhost:3000/cinema/${id}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		cinemaData = await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

async function updateCinemaDateAsync() {
	try {
		const url = `http://localhost:3000/cinema/${cinemaData.id}`;
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cinemaData),
		};

		const response = await fetch(url, options);
		cinemaData = await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

// Обработчики событий
function handleSeatClick(event) {
	if (!isFreeSeat(event.target)) return;

	toggleSelectedSeat(event.target);
	updateReservationState();
}

async function handleMovieSelectChange() {
	await toggleCinemaHall();
	updateReservationState();
}

async function handleReservation(event) {
	event.preventDefault();
	await reserveSelectedSeats();
	updateReservationState();
}

// Инициализация
async function initialize() {
	await getMoviesAsync();
	renderMoviesOptions();

	await toggleCinemaHall();

	updateReservationState();

	cinemaHall.addEventListener("click", handleSeatClick);
	movieSelect.addEventListener("change", handleMovieSelectChange);
	reserveBtn.addEventListener("click", handleReservation);
}

initialize();
