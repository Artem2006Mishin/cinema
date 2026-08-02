import { SEAT_STATUS } from "../config/constants.js";

export class CinemaSeat {
	#seatEl;

	constructor({ status, id }) {
		this.#seatEl = document.createElement("div");
		this.#seatEl.id = id;
		this.#seatEl.classList.add("seat");
		this.#seatEl.classList.add(`seat--${status}`);
	}

	get seatEl() {
		return this.#seatEl;
	}

	isFree() {
		return this.#seatEl.classList.contains(`seat--${SEAT_STATUS.FREE}`);
	}

	isSelected() {
		return this.#seatEl.classList.contains(`seat--${SEAT_STATUS.SELECTED}`);
	}

	toggleSelected() {
		this.#seatEl.classList.toggle(`seat--${SEAT_STATUS.SELECTED}`);
	}
}
