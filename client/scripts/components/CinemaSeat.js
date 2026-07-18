import { SEAT_STATUS } from "../config/constants.js";

export class CinemaSeat {
	#seatEl;

	constructor({ status, id }) {
		this.#seatEl = document.createElement("div");
		this.#seatEl.classList.add("seat");
		this.#seatEl.classList.add(`seat--${status}`);
		this.#seatEl.id = id;
	}

	get seatEl() {
		return this.#seatEl;
	}

	isFree() {
		return this.#seatEl.classList.contains(`seat--${SEAT_STATUS.FREE}`);
	}

	toggleStatus() {
		this.#seatEl.classList.toggle(`seat--${SEAT_STATUS.SELECTED}`);
	}
}
