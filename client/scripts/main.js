import { ApiService } from "./api/ApiService.js";
import { MovieService } from "./api/MovieService.js";
import { CinemaService } from "./api/CinemaService.js";
import { StorageService } from "./storage/StorageService.js";
import { MoviesController } from "./controllers/MoviesController.js";
import { CinemaController } from "./controllers/CinemaController.js";
import { ReservationController } from "./controllers/ReservationController.js";
import { STORAGE } from "./config/constants.js";
import { HttpError, NetworkError } from "./errors/ApiErrors.js";
import { ErrorNotification } from "./components/ErrorNotification.js";

const apiService = new ApiService();
const movieService = new MovieService(apiService);
const cinemaService = new CinemaService(apiService);
const storageService = new StorageService();
let errorNotification;

try {
	errorNotification = new ErrorNotification();
	errorNotification.hideError();

	const moviesController = new MoviesController(movieService, storageService);
	const cinemaController = new CinemaController(cinemaService, storageService);
	const reservationController = new ReservationController();

	moviesController.onMovieChange(async (ticketPrice, optionId) => {
		await cinemaController.respondToMovieChange(optionId);
		reservationController.ticketPrice = ticketPrice;
	});

	cinemaController.onSeatSelect((seatsCount) => {
		reservationController.respondToSeatsSelect(seatsCount);
	});

	reservationController.onSeatsReserve(() => {
		cinemaController.respondToSeatsReserve();
	});

	// нужно ли раскидать эту логику по компонентам
	storageService.init(STORAGE.SELECTED_OPTION_ID, "avengers-endgame");
	storageService.init(STORAGE.SELECTED_SEAT_IDS, []);

	await moviesController.init();
	await cinemaController.init();
	reservationController.init();
} catch (error) {
	if (error instanceof NetworkError) {
		errorNotification.showError("Check your internet connection");
	} else if (error instanceof HttpError) {
		errorNotification.showError("Service is temporarily unavailable");
	}

	console.error(error.message);
}
