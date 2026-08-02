export class ReservationController {
	#reserveBtnEl;
	#totalPriceEl;
	#selectedSeatsCountEl;
	#ticketPrice;
	#reserveSeatsHandler;

	// селекторы по умолчанию?
	constructor() {
		this.#reserveBtnEl = document.querySelector(".reservation__button");
		this.#totalPriceEl = document.querySelector("#total-price");
		this.#selectedSeatsCountEl = document.querySelector("#selected-seat-count");
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
