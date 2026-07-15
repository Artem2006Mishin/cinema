import { initMovies } from "./utils/movies.js";
import { initCinema } from "./utils/cinema.js";
import { initReservation } from "./utils/reservation.js";
import { saveToStorage } from "./utils/storage.js";

const $initStorageBtn = document.querySelector("#init-storage");
$initStorageBtn.addEventListener("click", () => {
	saveToStorage("optionId", "avengers-endgame");
});

async function main() {
	await initMovies();
	await initCinema();
	initReservation();
}

main();
