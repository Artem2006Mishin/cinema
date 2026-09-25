export default class ReservationController {
	#reserveBtnEl;
	#totalPriceEl;
	#selectedSeatsCountEl;
	#ticketPrice;
	#onSeatsReserve;

	constructor({ container }) {
		this.#reserveBtnEl = container.querySelector(".reservation__button");
		this.#totalPriceEl = container.querySelector("#total-price");
		this.#selectedSeatsCountEl = container.querySelector(
			"#selected-seat-count",
		);
	}

	set ticketPrice(ticketPrice) {
		this.#ticketPrice = ticketPrice;
	}

	init(ticketPrice, selectedSeatsCount) {
		this.#ticketPrice = ticketPrice;
		this.respondToSeatsSelect(selectedSeatsCount);

		this.#reserveBtnEl.addEventListener("click", async (event) => {
			await this.#handleReserveBtnClick(event);
		});
	}

	onSeatsReserve(callback) {
		this.#onSeatsReserve = callback;
	}

	respondToSeatsSelect(seatsCount) {
		this.#calculatePrice(seatsCount);
		this.#toggleReserveBtn(seatsCount);
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
		await this.#onSeatsReserve?.();
	}
}
