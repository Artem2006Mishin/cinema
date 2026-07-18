import { CinemaSeat } from "./CinemaSeat.js";

export class CinemaHall {
	#hallEl;
	#seats;

	constructor(selector = ".cinema__hall") {
		this.#hallEl = document.querySelector(selector);
		this.#seats = new Map();
		this.#hallEl.addEventListener("click", (event) => this.#handleClick(event));
	}

	render(hall) {
		this.#hallEl.innerHTML = "";
		hall.forEach((group) => {
			const groupEl = this.#createGroup(group);
			this.#hallEl.append(groupEl);
		});
	}

	#createGroup({ seats, columnsCount }) {
		const groupEl = document.createElement("div");
		groupEl.classList.add("cinema__group");
		groupEl.style.setProperty("--columns-count", columnsCount);

		seats.forEach((seat) => {
			const cinemaSeat = new CinemaSeat(seat);
			this.#seats.set(seat.id, cinemaSeat);
			groupEl.append(cinemaSeat.seatEl);
		});

		return groupEl;
	}

	#handleClick(event) {
		const seatEl = event.target.closest(".seat");
		if (!seatEl) return;

		const cinemaSeat = this.#seats.get(seatEl.id);
		if (!cinemaSeat || !cinemaSeat.isFree()) return;

		cinemaSeat.toggleStatus();
	}
}
