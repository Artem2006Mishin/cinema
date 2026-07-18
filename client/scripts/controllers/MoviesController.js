import { MovieDropdown } from "../components/MovieDropdown.js";
import { STORAGE } from "../config/constants.js";

export class MoviesController {
	#movieService;
	#storageService;
	#movieDropdown;

	constructor(movieService, storageService) {
		this.#movieService = movieService;
		this.#storageService = storageService;
		this.#movieDropdown = new MovieDropdown();
	}

	async init() {
		await this.#fetchAndRenderMovies();
		this.#restoreSelectedOption();
		this.#movieDropdown.onChange((id) => this.#saveSelectedOption(id));
	}

	#restoreSelectedOption() {
		const optionId = this.#storageService.get(STORAGE.OPTION_ID);
		this.#movieDropdown.selectOption(optionId);
	}

	#saveSelectedOption(id) {
		this.#storageService.set(STORAGE.OPTION_ID, id);
	}

	async #fetchAndRenderMovies() {
		const movies = await this.#movieService.getMovies();
		this.#movieDropdown.render(movies);
	}
}
