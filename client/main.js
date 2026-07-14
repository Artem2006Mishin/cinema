import { initMovies } from "./utils/movies.js";
import { initCinema } from "./utils/cinema.js";
import { initReservation } from "./utils/reservation.js";

async function main() {
	await initMovies();
	await initCinema();
	initReservation();
}

main();
