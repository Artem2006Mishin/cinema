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
import { PageTransition } from "./components/PageTransition.js";

let errorNotification;

try {
	errorNotification = new ErrorNotification();
	errorNotification.hideError();

	const pageTransition = new PageTransition();

	const storageService = new StorageService();
	storageService.init(STORAGE.MOVIE_ID, "avengers-endgame");
	storageService.init(STORAGE.SELECTED_SEAT_IDS, []);

	const apiService = new ApiService(storageService);
	const movieService = new MovieService(apiService);
	const cinemaService = new CinemaService(apiService);

	const moviesController = new MoviesController(movieService, storageService);
	const cinemaController = new CinemaController(cinemaService, storageService);
	const reservationController = new ReservationController();

	moviesController.onMovieChange(async (ticketPrice, movieId) => {
		await cinemaController.respondToMovieChange(movieId);
		reservationController.ticketPrice = ticketPrice;
	});

	cinemaController.onSeatSelect((seatsCount) => {
		reservationController.respondToSeatsSelect(seatsCount);
	});

	reservationController.onSeatsReserve(() => {
		cinemaController.respondToSeatsReserve();
	});

	await moviesController.init();
	const { movieId, ticketPrice } = moviesController.getActiveMovie();

	await cinemaController.init(movieId);
	const selectedSeatsCount = cinemaController.getSelectedSeatsCount();

	reservationController.init(ticketPrice, selectedSeatsCount);
} catch (error) {
	if (error instanceof NetworkError) {
		errorNotification.showError("Check your internet connection");
	} else if (error instanceof HttpError) {
		errorNotification.showError("Service is temporarily unavailable");
	}

	console.error(error.message);
}
