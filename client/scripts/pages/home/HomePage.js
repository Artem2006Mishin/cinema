import invariant from "tiny-invariant";
import services from "@/services.js";
import getHomeTemplate from "./home.template.js";
import MoviesController from "@controllers/MoviesController.js";
import CinemaController from "@controllers/CinemaController.js";
import ReservationController from "@controllers/ReservationController.js";
import { STORAGE } from "@config/constants.js";

export default class HomePage {
	#moviesController;
	#cinemaController;
	#reservationController;

	async render({ container }) {
		invariant(container, "HomePage: container is not found");

		services.storage.init(STORAGE.MOVIE_ID, "avengers-endgame");
		services.storage.init(STORAGE.SELECTED_SEAT_IDS, []);

		const template = getHomeTemplate();
		container.append(template);

		this.#moviesController = new MoviesController({
			container: container,
			movieService: services.movies,
			storageService: services.storage,
		});

		this.#cinemaController = new CinemaController({
			container: container,
			cinemaService: services.cinema,
			storageService: services.storage,
		});

		this.#reservationController = new ReservationController({
			container: container,
		});

		this.#moviesController.onMovieChange(async ({ movieId, moviePrice }) => {
			await this.#cinemaController.respondToMovieChange(movieId);
			this.#reservationController.ticketPrice = moviePrice;
		});

		this.#cinemaController.onSeatSelect((seatsCount) => {
			this.#reservationController.respondToSeatsSelect(seatsCount);
		});

		this.#reservationController.onSeatsReserve(async () => {
			await this.#cinemaController.respondToSeatsReserve();
		});

		await this.#moviesController.init();

		const { movieId, moviePrice } = this.#moviesController.getSelectedMovie();

		await this.#cinemaController.init(movieId);
		const selectedSeatsCount = this.#cinemaController.getSelectedSeatsCount();

		this.#reservationController.init(moviePrice, selectedSeatsCount);
	}

	destroy() {
		this.#moviesController = null;
		this.#cinemaController = null;
		this.#reservationController = null;
	}
}
