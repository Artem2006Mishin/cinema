import { isRequired, isFoundForSelector, isFunction } from "../utils/checks.js";

export class Dropdown {
	#dropdownEl;
	#changeHandler;

	constructor(selector = "#movie-dropdown") {
		this.#dropdownEl = document.querySelector(selector);
		isFoundForSelector(this.#dropdownEl, selector, "MovieDropdown");

		this.#changeHandler = null;
		this.#dropdownEl.addEventListener("change", () => this.#handleChange());
	}

	onChange(callback) {
		isFunction(callback, "MovieDropdown.onChange");
		this.#changeHandler = callback;
	}

	getSelectedOptionValue() {
		return Number(this.#dropdownEl.value);
	}

	getSelectedOptionId() {
		const { options, selectedIndex } = this.#dropdownEl;
		return options[selectedIndex].id;
	}

	render(movies) {
		isRequired(movies, "movies", "MovieDropdown.render");

		movies.forEach((movie) => {
			const optionEl = this.#createOption(movie);
			this.#dropdownEl.append(optionEl);
		});
	}

	selectOption(id) {
		isRequired(id, "id", "MovieDropdown.selectOption");

		const optionEl = document.querySelector(`#${id}`);
		if (optionEl) optionEl.selected = true;
	}

	#createOption(movie) {
		const optionEl = document.createElement("option");
		optionEl.id = movie.id;
		optionEl.value = movie.price;
		optionEl.textContent = movie.title;
		return optionEl;
	}

	#handleChange() {
		const id = this.getSelectedOptionId();
		this.#changeHandler?.(id);
	}
}
