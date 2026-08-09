import { Drum } from "../components/Drum.js";
import { STORAGE } from "../config/constants.js";
import { isFound, isFunction, isRequired } from "../utils/checks.js";

export class MoviesController {
	#movieService;
	#storageService;
	#moviePicker;
	#onMovieChange;

	constructor(movieService, storageService) {
		this.#movieService = movieService;
		this.#storageService = storageService;
		this.#moviePicker = new Drum();
	}

	async init() {
		await this.#loadMovies();
		this.#restoreChanges();

		this.#moviePicker.onWheel((movieId) => this.#handleMovieChange(movieId));
	}

	onMovieChange(callback) {
		isFunction(callback, "MoviesController");
		this.#onMovieChange = callback;
	}

	getActiveMovie() {
		const movieId = this.#moviePicker.getActiveListItemId();
		const ticketPrice = this.#moviePicker.getActiveListItemValue();

		isFound(movieId, "movieId", "MovieDropdown.getActiveMovie");
		isFound(ticketPrice, "ticketPrice", "MovieDropdown.getActiveMovie");

		return { movieId, ticketPrice };
	}

	async #loadMovies() {
		const movies = await this.#movieService.getMovies();
		isFound(movies, "movies", "MoviesController.loadMovies");
		this.#moviePicker.render(movies);
	}

	#restoreChanges() {
		const movieId = this.#getMovieIdFromStorage();
		this.#moviePicker.selectListItem(movieId);
	}

	#getMovieIdFromStorage() {
		const movieId = this.#storageService.get(STORAGE.MOVIE_ID);
		isFound(movieId, "movieId", "MovieDropdown.getMovieIdFromStorage");

		return movieId;
	}

	#setMovieIdToStorage(movieId) {
		isRequired(movieId, "movieId", "MoviesController.setMovieIdToStorage");
		this.#storageService.set(STORAGE.MOVIE_ID, movieId);
	}

	async #handleMovieChange(movieId) {
		try {
			this.#setMovieIdToStorage(movieId);

			const ticketPrice = this.#moviePicker.getActiveListItemValue();
			isFound(ticketPrice, "ticketPrice", "MoviesController.handleMovieChange");

			await this.#onMovieChange?.(ticketPrice, movieId);
		} catch (error) {
			console.log(error.message);
		}
	}
}
