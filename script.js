"use strict";

// dom-элементы
const cinemaHall = document.querySelector(".cinema__hall");
const movieSelect = document.querySelector("#movie-select");
const selectedSeatsCount = document.querySelector("#selected-seat-count");
const totalPrice = document.querySelector("#total-price");

// вспомогательные функции
function isFreeSeat(element) {
	const isSeat = element.classList.contains("seat");
	const isFree = !element.classList.contains("seat--occupied");

	return isSeat && isFree;
}

function toggleSelectedSeat(seat) {
	seat.classList.toggle("seat--selected");
}

function calculateSelectedSeatsCount() {
	const selectedSeats = document.querySelectorAll(
		".cinema__row .seat--selected",
	);

	return selectedSeats.length;
}

function updateReceipt() {
	const count = calculateSelectedSeatsCount();

	selectedSeatsCount.textContent = count;
	totalPrice.textContent = count * Number(movieSelect.value);
}

// Основные функции
function handleSeatClick(event) {
	const target = event.target;

	if (isFreeSeat(target)) {
		toggleSelectedSeat(target);
		updateReceipt();
	}
}

cinemaHall.addEventListener("click", handleSeatClick);

// ошибка: есть возможность выбрать разные места в разных фильмах
