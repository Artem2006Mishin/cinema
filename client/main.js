import { initMovies } from "./utils/movies.js";
import { initCinema } from "./utils/cinema.js";
import { initReservation } from "./utils/reservation.js";
import { initStorage } from "./utils/storage.js";

async function main() {
	initStorage("optionId", "avengers-endgame");
	await initMovies();
	await initCinema();
	initReservation();
}

main();
