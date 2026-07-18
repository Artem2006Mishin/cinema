import { getFromStorage } from "./storage.js";
import { API_URL } from "./api.js";

export async function saveCinemaData() {
	try {
		const url = `${API_URL}/cinema/${cinemaData.id}`;
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
