import invariant from "tiny-invariant";

const SCROLL_THRESHOLD = 40;

export default class Drum {
	#drumElement;
	#drumListElement;
	#drumItemElements = [];

	#drumItemHeight = 48;
	#selectedDrumItemIndex = 0;

	#isAnimating = false;
	#scroll = 0;
	#onWheel = null;

	constructor({ container, selector }) {
		invariant(container, "Drum: container is not found");
		invariant(selector, "Drum: selector is not found");

		this.#drumElement = container.querySelector(selector);
		this.#drumListElement = container.querySelector("[data-js='drum-list']");

		invariant(this.#drumElement, "Drum: drumElement is not found");
		invariant(this.#drumListElement, "Drum: drumListElement is not found");
	}

	init() {
		this.#drumElement.addEventListener("wheel", async (event) => {
			await this.#handleWheel(event);
		});

		this.#drumElement.addEventListener("click", async (event) => {
			await this.#handleClick(event);
		});
	}

	onWheel(callback) {
		invariant(callback, "Drum: callback is not found");
		this.#onWheel = callback;
	}

	render({ drumItemsData }) {
		invariant(drumItemsData, "Drum: drumItemsData is not found");

		drumItemsData.forEach((data, index) => {
			const drumItem = this.#createDrumItem(data);

			this.#updateDrumItemState({
				drumItem: drumItem,
				drumItemIndex: index,
			});

			this.#drumItemElements.push(drumItem);
			this.#drumListElement.append(drumItem);
		});
	}

	getDrumValue() {
		const drumItem = this.#drumItemElements[this.#selectedDrumItemIndex];

		return {
			id: drumItem.dataset.js,
			value: Number(drumItem.dataset.value),
		};
	}

	setDrumValue({ drumItemId }) {
		invariant(drumItemId, "Drum: drumItemId is not found");

		const drumItemIndex = this.#drumItemElements.findIndex(
			(item) => item.dataset.js === drumItemId,
		);
		this.#selectedDrumItemIndex = drumItemIndex;

		this.#updateDrumState();
	}

	#setDrumListPosition() {
		const offset = -(this.#selectedDrumItemIndex - 1) * this.#drumItemHeight;
		this.#drumListElement.style.transform = `translateY(${offset}px)`;
	}

	#createDrumItem(data) {
		const item = document.createElement("li");

		item.classList.add("drum__item");

		item.dataset.js = data.id;
		item.dataset.value = data.price;

		item.textContent = data.title;

		return item;
	}

	#updateDrumState() {
		this.#setDrumListPosition();

		this.#drumItemElements.forEach((item, index) => {
			this.#updateDrumItemState({ drumItem: item, drumItemIndex: index });
		});
	}

	#updateDrumItemState({ drumItem, drumItemIndex }) {
		const distance = Math.abs(drumItemIndex - this.#selectedDrumItemIndex);

		drumItem.classList.toggle("drum__item--active", distance === 0);
		drumItem.classList.toggle("drum__item--hidden", distance > 1);
	}

	#lockDuringAnimation() {
		this.#isAnimating = true;

		setTimeout(() => {
			this.#isAnimating = false;
		}, 300);
	}

	#updateSelectedDrumItemIndex(event) {
		const direction = event.deltaY > 0 ? 1 : -1;

		if (
			this.#selectedDrumItemIndex + direction >= 0 &&
			this.#selectedDrumItemIndex + direction < this.#drumItemElements.length
		) {
			this.#selectedDrumItemIndex += direction;
			return true;
		}

		return false;
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

	async #handleWheel(event) {
		event.preventDefault();

		const isAccumulated = this.#accumulateScroll(event);
		if (!isAccumulated) return;

		if (this.#isAnimating) return;
		this.#lockDuringAnimation();

		const isChanged = this.#updateSelectedDrumItemIndex(event);
		if (!isChanged) return;

		this.#updateDrumState();

		const { id } = this.getDrumValue();
		await this.#onWheel?.(id);
	}

	async #handleClick(event) {
		event.preventDefault();

		const li = event.target.closest("li");
		this.setDrumValue({ drumItemId: li.dataset.js });

		const { id } = this.getDrumValue();
		await this.#onWheel?.(id);
	}
}
