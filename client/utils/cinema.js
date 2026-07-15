import { getFromStorage } from "./storage.js";
import { API_URL } from "./api.js";

function isFreeSeat(seat) {
	return seat.classList.contains("seat--free");
}

function toggleSeatState(seat) {
	seat.classList.toggle("seat--selected");
}

function createSeat(status, index) {
	const seat = document.createElement("div");
	seat.classList.add("seat");
	seat.classList.add(`seat--${status}`);
	seat.dataset.seatIndex = index;
	return seat;
}

function createGroup({ columnsCount, seats }, index) {
	const group = document.createElement("div");
	group.classList.add("cinema__group");
	group.classList.add(`cinema__group--cols${columnsCount}`);
	group.dataset.groupIndex = index;

	seats.forEach((seat, index) => {
		const seatElement = createSeat(seat.status, index);
		group.append(seatElement);
	});

	return group;
}

export function renderCinemaHall() {
	$cinemaHall.innerHTML = "";
	cinemaData.hall.forEach((group, index) => {
		const groupElement = createGroup(group, index);
		$cinemaHall.append(groupElement);
	});
}

async function loadCinemaData(id) {
	try {
		const url = `${API_URL}/${id}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		cinemaData = await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

export async function saveCinemaData() {
	try {
		const url = `${API_URL}/${cinemaData.id}`;
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

function handleSeatClick(event) {
	if (!isFreeSeat(event.target)) return;
	toggleSeatState(event.target);
}

export const $cinemaHall = document.querySelector(".cinema__hall");
export let cinemaData;

export async function updateCinemaData() {
	const id = getFromStorage("optionId");
	await loadCinemaData(id);
	renderCinemaHall();
}

export async function initCinema() {
	await updateCinemaData();
	$cinemaHall.addEventListener("click", handleSeatClick);
}
