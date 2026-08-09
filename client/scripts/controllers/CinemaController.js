import { CinemaHall } from "../components/CinemaHall.js";
import { STORAGE, SEAT_STATUS } from "../config/constants.js";
import { isFound, isFunction, isRequired } from "../utils/checks.js";

export class CinemaController {
	#cinemaService;
	#storageService;
	#cinemaHall;
	#cinemaData;
	#onSeatSelect;

	constructor(cinemaService, storageService) {
		this.#cinemaService = cinemaService;
		this.#storageService = storageService;
		this.#cinemaHall = new CinemaHall();
	}

	async init(movieId) {
		isRequired(movieId, "movieId", "CinemaController");

		await this.#loadCinema(movieId);
		this.#restoreSelectedSeats();

		this.#cinemaHall.onSelect((seatsMap) => this.#handleSeatSelect(seatsMap));
	}

	onSeatSelect(callback) {
		isFunction(callback, "CinemaController");
		this.#onSeatSelect = callback;
	}

	getSelectedSeatsCount() {
		const selectedSeat = this.#cinemaHall.getSelectedSeatIds();
		isFound(
			selectedSeat,
			"selectedSeat",
			"CinemaController.getSelectedSeatsCount",
		);

		return selectedSeat.length;
	}

	async respondToMovieChange(movieId) {
		isRequired(movieId, "movieId", "CinemaController.respondToMovieChange");

		await this.#loadCinema(movieId);

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#onSeatSelect(0);
	}

	async respondToSeatsReserve() {
		this.#setOccupiedStatus();

		this.#cinemaData = await this.#cinemaService.saveCinemaData(
			this.#cinemaData,
			this.#cinemaData.id,
		);

		this.#cinemaHall.render(this.#cinemaData.hall);

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#onSeatSelect(0);
	}

	async #loadCinema(movieId) {
		this.#cinemaData = await this.#cinemaService.getCinemaData(movieId);
		this.#cinemaHall.render(this.#cinemaData.hall);
	}

	#restoreSelectedSeats() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
		isFound(seatIds, "seatIds", "CinemaController.restoreSelectedSeats");

		this.#cinemaHall.selectSeats(seatIds);
	}

	#setOccupiedStatus() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
		isFound(seatIds, "seatIds", "CinemaController.setOccupiedStatus");

		const allSeats = this.#cinemaData.hall.flatMap((group) => group.seats);
		seatIds.forEach((id) => {
			const selectedSeat = allSeats.find((seat) => seat.id === id);
			selectedSeat.status = SEAT_STATUS.OCCUPIED;
		});
	}

	#handleSeatSelect(seatsMap = new Map()) {
		const seatIds = [];
		for (const [id, cinemaSeat] of seatsMap) {
			if (cinemaSeat.isSelected()) {
				seatIds.push(id);
			}
		}

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, seatIds);
		this.#onSeatSelect(seatIds.length);
	}
}
