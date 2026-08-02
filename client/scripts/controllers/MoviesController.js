import { Dropdown } from "../components/Dropdown.js";
import { STORAGE } from "../config/constants.js";
import { isFound, isFunction, isRequired } from "../utils/checks.js";

export class MoviesController {
	#movieService;
	#storageService;
	#movieDropdown;
	#movieChangeHandler;

	constructor(movieService, storageService) {
		this.#movieService = movieService;
		this.#storageService = storageService;
		this.#movieDropdown = new Dropdown();
		this.#movieChangeHandler = null;
	}

	onMovieChange(callback) {
		isFunction(callback, "MoviesController");
		this.#movieChangeHandler = callback;
	}

	async init() {
		await this.#loadMovies();
		this.#restoreSelectedOption();

		const optionId = this.#movieDropdown.getSelectedOptionId();
		await this.#handleMovieChange(optionId);

		this.#movieDropdown.onChange((id) => this.#handleMovieChange(id));
	}

	#restoreSelectedOption() {
		const optionId = this.#getOptionIdFromStorage();
		this.#movieDropdown.selectOption(optionId);
	}

	#getOptionIdFromStorage() {
		const optionId = this.#storageService.get(STORAGE.SELECTED_OPTION_ID);
		isFound(optionId, "optionId", "MovieDropdown.restoreSelectedOption");
		return optionId;
	}

	#setOptionIdToStorage(id) {
		isRequired(id, "id", "MoviesController.handleMovieChange");
		this.#storageService.set(STORAGE.SELECTED_OPTION_ID, id);
	}

	async #loadMovies() {
		const movies = await this.#movieService.getMovies();
		isFound(movies, "movies", "MoviesController.loadMovies");
		this.#movieDropdown.render(movies);
	}

	async #handleMovieChange(optionId) {
		try {
			this.#setOptionIdToStorage(optionId);

			const ticketPrice = this.#movieDropdown.getSelectedOptionValue();
			isFound(ticketPrice, "ticketPrice", "MoviesController.handleMovieChange");

			await this.#movieChangeHandler?.(ticketPrice, optionId);
		} catch (error) {
			console.log(error.message);
		}
	}
}
