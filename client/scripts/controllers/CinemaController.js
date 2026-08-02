import { CinemaHall } from "../components/CinemaHall.js";
import { STORAGE, SEAT_STATUS } from "../config/constants.js";
import { isFound, isFunction, isRequired } from "../utils/checks.js";

export class CinemaController {
	#cinemaService;
	#storageService;
	#cinemaHall;
	#cinemaData;
	#seatSelectHandler;

	constructor(cinemaService, storageService) {
		this.#cinemaService = cinemaService;
		this.#storageService = storageService;
		this.#cinemaHall = new CinemaHall();
		this.#seatSelectHandler = null;
	}

	onSeatSelect(callback) {
		isFunction(callback, "CinemaController");
		this.#seatSelectHandler = callback;
	}

	async init() {
		this.#restoreSelectedSeats();
		this.#cinemaHall.onSelect((seatsMap) => this.#handleSeatSelect(seatsMap));
	}

	async respondToMovieChange(optionId) {
		isRequired(optionId, "optionId", "CinemaController.respondToMovieChange");

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#seatSelectHandler(0);

		await this.#loadCinema(optionId);
	}

	async respondToSeatsReserve() {
		this.#setOccupiedStatusForSelectedSeats();
		this.#cinemaData = await this.#cinemaService.saveCinemaData(
			this.#cinemaData,
			this.#cinemaData.id,
		);
		this.#cinemaHall.render(this.#cinemaData.hall);
		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#seatSelectHandler(0);
	}

	#setOccupiedStatusForSelectedSeats() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
		const allSeats = this.#cinemaData.hall.flatMap((group) => group.seats);
		seatIds.forEach((id) => {
			const selectedSeat = allSeats.find((seat) => seat.id === id);
			selectedSeat.status = SEAT_STATUS.OCCUPIED;
		});
	}

	#restoreSelectedSeats() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
		isFound(seatIds, "seatIds", "CinemaController.restoreSelectedSeats");

		this.#cinemaHall.selectSeats(seatIds);
		this.#seatSelectHandler(seatIds.length);
	}

	#handleSeatSelect(seatsMap = new Map()) {
		const seatIds = [];
		for (const [id, cinemaSeat] of seatsMap) {
			if (cinemaSeat.isSelected()) {
				seatIds.push(id);
			}
		}

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, seatIds);
		this.#seatSelectHandler(seatIds.length);
	}

	async #loadCinema(optionId) {
		isRequired(optionId, "optionId", "CinemaController.loadCinema");

		this.#cinemaData = await this.#cinemaService.getCinemaData(optionId);
		this.#cinemaHall.render(this.#cinemaData.hall);
	}
}
