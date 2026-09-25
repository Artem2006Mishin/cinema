import { CinemaSeat } from "./CinemaSeat.js";

export class CinemaHall {
	#cinemaHallEl;
	#cinemaSeatsMap;
	#onSelect;

	constructor({ container, selector }) {
		this.#cinemaHallEl = container.querySelector(selector);

		this.#cinemaSeatsMap = new Map();
		this.#onSelect = null;

		this.#cinemaHallEl.addEventListener("click", (event) =>
			this.#handleClick(event),
		);
	}

	onSelect(callback) {
		this.#onSelect = callback;
	}

	getSelectedSeatIds() {
		const selectedSeatIds = [];
		for (const [id, seat] of this.#cinemaSeatsMap) {
			if (seat.isSelected()) {
				selectedSeatIds.push(id);
			}
		}
		return selectedSeatIds;
	}

	render(cinemaHallData) {
		this.#cinemaHallEl.innerHTML = "";
		this.#cinemaSeatsMap.clear();

		cinemaHallData.forEach((groupData) => {
			const groupEl = this.#createCinemaGroup(groupData);
			this.#cinemaHallEl.append(groupEl);
		});
	}

	selectSeats(seatIds) {
		seatIds.forEach((id) => {
			const cinemaSeat = this.#cinemaSeatsMap.get(id);
			cinemaSeat?.toggleSelected();
		});
	}

	#createCinemaGroup({ seats, columnsCount }) {
		const groupEl = document.createElement("div");

		groupEl.classList.add("cinema__group");
		groupEl.style.setProperty("--columns-count", columnsCount);

		seats.forEach((seatData) => {
			const cinemaSeat = new CinemaSeat(seatData);
			this.#cinemaSeatsMap.set(seatData.id, cinemaSeat);
			groupEl.append(cinemaSeat.seatEl);
		});

		return groupEl;
	}

	#handleClick(event) {
		const seatEl = event.target.closest(".seat");
		if (!seatEl) return;

		const cinemaSeat = this.#cinemaSeatsMap.get(seatEl.id);
		if (!cinemaSeat || !cinemaSeat.isFree()) return;

		cinemaSeat.toggleSelected();
		this.#onSelect?.(this.#cinemaSeatsMap);
	}
}
