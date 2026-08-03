import { isFound } from "../utils/checks.js";

export class ReservationController {
	#reserveBtnEl;
	#totalPriceEl;
	#selectedSeatsCountEl;
	#ticketPrice;
	#reserveSeatsHandler;

	constructor() {
		this.#reserveBtnEl = document.querySelector(".reservation__button");
		isFound(
			this.#reserveBtnEl,
			".reservation__button",
			"ReservationController",
		);

		this.#totalPriceEl = document.querySelector("#total-price");
		isFound(this.#totalPriceEl, "#total-price", "ReservationController");

		this.#selectedSeatsCountEl = document.querySelector("#selected-seat-count");
		isFound(
			this.#selectedSeatsCountEl,
			"#selected-seat-count",
			"ReservationController",
		);

		this.#ticketPrice = 0;
		this.#reserveSeatsHandler = null;
	}

	set ticketPrice(ticketPrice) {
		this.#ticketPrice = ticketPrice;
	}

	init() {
		this.#reserveBtnEl.addEventListener("click", (event) => {
			this.#handleReserveBtnClick(event);
		});
	}

	respondToSeatsSelect(seatsCount) {
		this.#calculatePrice(seatsCount);
		this.#toggleReserveBtn(seatsCount);
	}

	onSeatsReserve(callback) {
		this.#reserveSeatsHandler = callback;
	}

	#calculatePrice(seatsCount) {
		this.#selectedSeatsCountEl.textContent = seatsCount;
		this.#totalPriceEl.textContent = seatsCount * this.#ticketPrice;
	}

	#toggleReserveBtn(seatsCount) {
		if (!seatsCount) {
			this.#reserveBtnEl.classList.add("reservation__button--inactive");
			this.#reserveBtnEl.disabled = true;
		} else {
			this.#reserveBtnEl.classList.remove("reservation__button--inactive");
			this.#reserveBtnEl.disabled = false;
		}
	}

	async #handleReserveBtnClick(event) {
		event.preventDefault();
		await this.#reserveSeatsHandler?.();
	}
}
