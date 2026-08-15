import { isFound, isRequired, isFunction } from "../utils/checks.js";
import { SCROLL_THRESHOLD } from "../config/constants.js";

export class Drum {
	#rootEl;
	#listEl;
	#itemEls;
	#itemHeight;
	#selectedIndex;
	#isAnimating;
	#scroll;
	#onWheel;

	constructor(selector = "#movie-drum") {
		this.#rootEl = document.querySelector(selector);
		isFound(this.#rootEl, selector, "Drum");

		this.#listEl = this.#rootEl.querySelector(".drum__list");
		isFound(this.#listEl, ".drum__list", "Drum");

		this.#itemEls = [];
		this.#itemHeight = this.#readListItemHeight();
		this.#selectedIndex = 0;
		this.#isAnimating = false;
		this.#scroll = 0;
		this.#onWheel = null;

		this.#setListPosition();

		this.#rootEl.addEventListener("wheel", (event) => {
			this.#handleWheel(event);
		});
	}

	onWheel(callback) {
		isFunction(callback, "Drum.onWheel");
		this.#onWheel = callback;
	}

	getActiveListItemValue() {
		const itemEl = this.#itemEls[this.#selectedIndex];
		return Number(itemEl.dataset.value);
	}

	getActiveListItemId() {
		return this.#itemEls[this.#selectedIndex].id;
	}

	render(movies) {
		isRequired(movies, "movies", "Drum.render");

		movies.forEach((movie, index) => {
			const itemEl = this.#createListItem(movie);
			this.#makeListItemActive(itemEl, index);
			this.#itemEls.push(itemEl);
			this.#listEl.append(itemEl);
		});
	}

	selectListItem(id) {
		isRequired(id, "id", "Drum.selectListItem");

		const itemIndex = this.#searchListItemIndexById(id);
		this.#selectedIndex = itemIndex;

		this.#setListPosition();
		this.#itemEls.forEach((itemEl, index) => {
			this.#makeListItemActive(itemEl, index);
		});
	}

	#readListItemHeight() {
		const styles = getComputedStyle(this.#rootEl);
		const raw = styles.getPropertyValue("--item-height");
		isFound(raw, "--item-height", "Drum.readItemHeight");
		return parseFloat(raw);
	}

	#setListPosition() {
		const offset = this.#calculateOffset();
		this.#listEl.style.transform = `translateY(${offset}px)`;
	}

	#calculateOffset() {
		return -(this.#selectedIndex - 1) * this.#itemHeight;
	}

	#createListItem(movie) {
		const item = document.createElement("li");
		item.classList.add("drum__item");
		item.id = movie.id;
		item.dataset.value = movie.price;
		item.textContent = movie.title;
		return item;
	}

	#searchListItemIndexById(id) {
		return this.#itemEls.findIndex((itemEl) => itemEl.id === id);
	}

	#makeListItemActive(itemEl, itemIndex) {
		const distance = Math.abs(itemIndex - this.#selectedIndex);
		itemEl.classList.toggle("drum__item--active", distance === 0);
		itemEl.classList.toggle("drum__item--hidden", distance > 1);
	}

	#lockDuringAnimation() {
		this.#isAnimating = true;
		setTimeout(() => {
			this.#isAnimating = false;
		}, 300);
	}

	#changeSelectIndex(event) {
		const direction = event.deltaY > 0 ? 1 : -1;

		if (!this.#isValidSelectedIndex(direction)) {
			return false;
		}

		this.#selectedIndex += direction;
		return true;
	}

	#isValidSelectedIndex(direction) {
		return (
			this.#selectedIndex + direction >= 0 &&
			this.#selectedIndex + direction < this.#itemEls.length
		);
	}

	#accumulateScroll(event) {
		this.#scroll += event.deltaY;

		if (Math.abs(this.#scroll) < SCROLL_THRESHOLD) {
			this.#scroll = 0;
			return false;
		}

		this.#scroll = 0;
		return true;
	}

	#handleWheel(event) {
		event.preventDefault();

		const isAccumulated = this.#accumulateScroll(event);
		if (!isAccumulated) return;

		if (this.#isAnimating) return;
		this.#lockDuringAnimation();

		const isChanged = this.#changeSelectIndex(event);
		if (!isChanged) return;

		this.#setListPosition();
		this.#itemEls.forEach((itemEl, index) => {
			this.#makeListItemActive(itemEl, index);
		});

		const itemId = this.getActiveListItemId();
		this.#onWheel?.(itemId);
	}
}
