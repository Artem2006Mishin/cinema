export class MovieDropdown {
	#dropdownEl;
	#onChangeHandler;

	constructor(selector = "#movie-dropdown") {
		this.#dropdownEl = document.querySelector(selector);
		this.#onChangeHandler = null;
		this.#dropdownEl.addEventListener("change", () => this.#handleChange());
	}

	selectOption(id) {
		const optionEl = document.querySelector(`#${id}`);
		if (optionEl) optionEl.selected = true;
	}

	render(movies) {
		movies.forEach((movie) => {
			const optionEl = this.#createOption(movie);
			this.#dropdownEl.append(optionEl);
		});
	}

	onChange(callback) {
		this.#onChangeHandler = callback;
	}

	#handleChange() {
		const id = this.#getSelectedOptionId();
		this.#onChangeHandler?.(id);
	}

	#getSelectedOptionId() {
		const { options, selectedIndex } = this.#dropdownEl;
		return options[selectedIndex].id;
	}

	#createOption(movie) {
		const optionEl = document.createElement("option");
		optionEl.id = movie.id;
		optionEl.value = movie.price;
		optionEl.textContent = movie.title;
		return optionEl;
	}
}
