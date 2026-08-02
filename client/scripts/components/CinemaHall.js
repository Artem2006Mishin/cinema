import { isFoundForSelector, isFunction, isRequired } from "../utils/checks.js";
import { CinemaSeat } from "./CinemaSeat.js";

export class CinemaHall {
	#hallEl;
	#seatsMap;
	#onSelectHandler;

	constructor(selector = ".cinema__hall") {
		this.#hallEl = document.querySelector(selector);
		isFoundForSelector(this.#hallEl, selector, "CinemaHall");
		this.#seatsMap = new Map();
		this.#onSelectHandler = null;
		this.#hallEl.addEventListener("click", (event) => this.#handleClick(event));
	}

	render(hall) {
		isRequired(hall, "hall", "CinemaHall.render");

		this.#hallEl.innerHTML = "";
		this.#seatsMap.clear();

		hall.forEach((group) => {
			const groupEl = this.#createGroup(group);
			this.#hallEl.append(groupEl);
		});
	}

	selectSeats(seatIds) {
		isRequired(seatIds, "seatIds", "CinemaHall.render");

		seatIds.forEach((id) => {
			const cinemaSeat = this.#seatsMap.get(id);
			cinemaSeat?.toggleSelected();
		});
	}

	onSelect(callback) {
		isFunction(callback, "CinemaHall");
		this.#onSelectHandler = callback;
	}

	#createGroup({ seats, columnsCount }) {
		const groupEl = document.createElement("div");

		groupEl.classList.add("cinema__group");
		groupEl.style.setProperty("--columns-count", columnsCount);

		seats.forEach((seat) => {
			const cinemaSeat = new CinemaSeat(seat);
			this.#seatsMap.set(seat.id, cinemaSeat);
			groupEl.append(cinemaSeat.seatEl);
		});

		return groupEl;
	}

	#handleClick(event) {
		const seatEl = event.target.closest(".seat");
		if (!seatEl) return;

		const cinemaSeat = this.#seatsMap.get(seatEl.id);
		if (!cinemaSeat || !cinemaSeat.isFree()) return;

		cinemaSeat.toggleSelected();
		this.#onSelectHandler?.(this.#seatsMap);
	}
}
