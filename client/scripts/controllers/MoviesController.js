import invariant from "tiny-invariant";
import Drum from "@components/Drum.js";
import { STORAGE } from "@config/constants.js";

export default class MoviesController {
	#movieService;
	#storageService;
	#moviePicker;
	#onMovieChange;

	constructor({ container, movieService, storageService }) {
		invariant(container, "MoviesController: container is not found");
		invariant(movieService, "MoviesController: movieService is not found");
		invariant(storageService, "MoviesController: storageService is not found");

		this.#movieService = movieService;
		this.#storageService = storageService;

		this.#moviePicker = new Drum({
			container: container,
			selector: "[data-js='drum']",
		});
	}

	async init() {
		await this.#loadMovies();

		this.#moviePicker.init();

		this.#restoreChanges();

		this.#moviePicker.onWheel(async (movieId) => {
			await this.#handleMovieChange(movieId);
		});
	}

	onMovieChange(callback) {
		invariant(callback, "MoviesController: callback is not found");
		this.#onMovieChange = callback;
	}

	getSelectedMovie() {
		const { id: movieId, value: moviePrice } = this.#moviePicker.getDrumValue();

		invariant(movieId, "MoviesController: movieId is not found");
		invariant(moviePrice, "MoviesController: moviePrice is not found");

		return { movieId, moviePrice };
	}

	async #loadMovies() {
		const token = this.#storageService.get(STORAGE.ACCESS_TOKEN);
		const movies = await this.#movieService.getMovies({ token: token });
		invariant(movies, "MoviesController: movies is not found");

		this.#moviePicker.render({ drumItemsData: movies });
	}

	#restoreChanges() {
		const movieId = this.#storageService.get(STORAGE.MOVIE_ID);
		this.#moviePicker.setDrumValue({ drumItemId: movieId });
	}

	async #handleMovieChange(movieId) {
		try {
			this.#storageService.set(STORAGE.MOVIE_ID, movieId);

			const { value: moviePrice } = this.#moviePicker.getDrumValue();
			invariant(moviePrice, "MoviesController: moviePrice is not found");

			await this.#onMovieChange?.({
				movieId,
				moviePrice,
			});
		} catch (error) {
			console.error(error.message);
		}
	}
}
