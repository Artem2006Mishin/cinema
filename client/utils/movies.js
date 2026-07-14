import { getFromStorage, saveToStorage } from "./storage.js";
import { updateCinemaData } from "./cinema.js";
import { updateReservationState } from "./reservation.js";

const OPTION_ID = "optionId"; // Сделать файл с такими названиями, потому что cinema его тоже исспльзует

function getOptionId() {
	const options = $movieDropdown.options;
	const selectedIndex = $movieDropdown.selectedIndex;
	return options[selectedIndex].id;
}

function createOption(movie) {
	const option = document.createElement("option");
	option.id = movie.id;
	option.value = movie.price;
	option.textContent = movie.title;
	return option;
}

function setDropdownValue() {
	const id = getFromStorage(OPTION_ID);
	const option = document.querySelector(`#${id}`);
	option.selected = true;
}

function renderOptions(movies) {
	movies.forEach((movie) => {
		const option = createOption(movie);
		$movieDropdown.append(option);
	});
}

async function getMovies() {
	try {
		const url = "http://localhost:3000/movies";
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const movies = await response.json();
		return movies;
	} catch (error) {
		console.error(error.message);
	}
}

async function handleDropdownChange() {
	const id = getOptionId($movieDropdown);
	saveToStorage(OPTION_ID, id);
	await updateCinemaData();
	updateReservationState();
}

export const $movieDropdown = document.querySelector("#movie-dropdown");

export async function initMovies() {
	const movies = await getMovies();
	renderOptions(movies);
	setDropdownValue();
	$movieDropdown.addEventListener("change", handleDropdownChange);
}
