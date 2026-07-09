"use strict";

// dom-элементы
const cinemaHall = document.querySelector(".cinema__hall");
const movieSelect = document.querySelector("#movie-select");
const selectedSeatsCount = document.querySelector("#selected-seat-count");
const totalPrice = document.querySelector("#total-price");

// Переменные

// Вспомогательные функции
function isFreeSeat(element) {
	const isSeat = element.classList.contains("seat");
	const isFree = !element.classList.contains("seat--occupied");

	return isSeat && isFree;
}

function toggleSelectedSeat(seat) {
	seat.classList.toggle("seat--selected");
}

function calculateSelectedSeatsCount() {
	const seats = document.querySelectorAll(".cinema__row .seat--selected");

	return seats.length;
}

function updateReceipt() {
	const count = calculateSelectedSeatsCount();

	selectedSeatsCount.textContent = count;
	totalPrice.textContent = count * Number(movieSelect.value);
}

function createMovieOption(movie) {
	const option = document.createElement("option");

	option.id = movie.id;
	option.value = movie.price;
	option.textContent = movie.title;

	return option;
}

function getCurrentMovieId() {
	const options = movieSelect.options;
	const selectedIndex = movieSelect.selectedIndex;

	if (selectedIndex < 0) return "avengers-endgame";
	return options[selectedIndex].id;
}

function createCinemaSeat(status) {
	const seat = document.createElement("div");
	seat.classList.add("seat");
	seat.classList.add(`seat--${status}`);

	return seat;
}

function createCinemaGroup({ columnsCount, seats }) {
	const group = document.createElement("div");
	group.classList.add("cinema__group");
	group.classList.add(`cinema__group--cols${columnsCount}`);

	seats.forEach((seat) => {
		const seatElement = createCinemaSeat(seat.status);
		group.append(seatElement);
	});

	return group;
}

// Асинхронные функции
async function getMoviesAsync() {
	try {
		const response = await fetch("http://localhost:3000/movies");

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const movies = await response.json();

		return movies;
	} catch (error) {
		console.error(error.message);
	}
}

async function getCinemaHallForCurrentMovieAsync(id) {
	try {
		const response = await fetch(`http://localhost:3000/cinema?movieId=${id}`);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();
		const movieHall = data[0].hall;

		return movieHall;
	} catch (error) {
		console.error(error.message);
	}
}

// Основные функции
async function renderMoviesOptions() {
	const movies = await getMoviesAsync();

	movies.forEach((movie) => {
		const movieOption = createMovieOption(movie);
		movieSelect.append(movieOption);
	});
}

async function renderCinemaHall() {
	const movieId = getCurrentMovieId();
	const hall = await getCinemaHallForCurrentMovieAsync(movieId);

	hall.forEach((group) => {
		const groupElement = createCinemaGroup(group);
		cinemaHall.append(groupElement);
	});
}

function handleSeatClick(event) {
	const target = event.target;

	if (!isFreeSeat(target)) return;

	toggleSelectedSeat(target);
	updateReceipt();
}

cinemaHall.addEventListener("click", handleSeatClick);

// ошибка: есть возможность выбрать разные места в разных фильмах

renderMoviesOptions();
renderCinemaHall();
