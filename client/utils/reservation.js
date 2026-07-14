import { $movieDropdown } from "./movies.js";
import {
	$cinemaHall,
	cinemaData,
	saveCinemaData,
	renderCinemaHall,
} from "./cinema.js";

const $selectedSeatsCount = document.querySelector("#selected-seat-count");
const $totalPrice = document.querySelector("#total-price");
const $reserveBtn = document.querySelector(".reservation__button");

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

function toggleReserveBtn(isEmpty) {
	if (isEmpty) {
		$reserveBtn.classList.add("reservation__button--inactive");
		$reserveBtn.disabled = true;
	} else {
		$reserveBtn.classList.remove("reservation__button--inactive");
		$reserveBtn.disabled = false;
	}
}

function updateReceipt(count) {
	$selectedSeatsCount.textContent = count;
	$totalPrice.textContent = count * Number($movieDropdown.value);
}

function reserveSeat(groupIndex, seatIndex) {
	cinemaData.hall[groupIndex].seats[seatIndex].status = "occupied";
}

async function reserveSelectedSeats() {
	const seats = getSelectedSeats();
	seats.forEach((seat) => {
		const { groupIndex, seatIndex } = getSeatPosition(seat);
		reserveSeat(groupIndex, seatIndex);
	});

	await saveCinemaData();
	renderCinemaHall();
}

async function handleReservation(event) {
	event.preventDefault();
	await reserveSelectedSeats();
	updateReservationState();
}

export function updateReservationState() {
	const seats = getSelectedSeats();
	const count = seats.length;
	updateReceipt(count);
	const isEmpty = !count;
	toggleReserveBtn(isEmpty);
}

export function initReservation() {
	$cinemaHall.addEventListener("click", updateReservationState);
	$reserveBtn.addEventListener("click", handleReservation);
}
