import invariant from "tiny-invariant";
import { CinemaHall } from "../components/CinemaHall.js";
import { STORAGE, SEAT_STATUS } from "../config/constants.js";

export default class CinemaController {
	#cinemaService;
	#storageService;
	#cinemaHall;
	#cinemaData;
	#onSeatSelect;

	constructor({ container, cinemaService, storageService }) {
		invariant(container, "CinemaController: container is not found");
		invariant(cinemaService, "CinemaController: movieService is not found");
		invariant(storageService, "CinemaController: storageService is not found");

		this.#cinemaService = cinemaService;
		this.#storageService = storageService;

		this.#cinemaHall = new CinemaHall({
			container: container,
			selector: ".cinema__hall",
		});
	}

	async init(movieId) {
		await this.#loadCinema(movieId);

		this.#restoreSelectedSeats();

		this.#cinemaHall.onSelect((seatsMap) => this.#handleSeatSelect(seatsMap));
	}

	onSeatSelect(callback) {
		this.#onSeatSelect = callback;
	}

	getSelectedSeatsCount() {
		const selectedSeat = this.#cinemaHall.getSelectedSeatIds();
		return selectedSeat.length;
	}

	async respondToMovieChange(movieId) {
		await this.#loadCinema(movieId);

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#onSeatSelect(0);
	}

	async respondToSeatsReserve() {
		this.#setOccupiedStatus();

		const token = this.#storageService.get(STORAGE.ACCESS_TOKEN);

		this.#cinemaData = await this.#cinemaService.saveCinemaData({
			token: token,
			payload: this.#cinemaData,
			movieId: this.#cinemaData.id,
		});

		this.#cinemaHall.render(this.#cinemaData.hall);

		this.#storageService.set(STORAGE.SELECTED_SEAT_IDS, []);
		this.#onSeatSelect(0);
	}

	async #loadCinema(movieId) {
		const token = this.#storageService.get(STORAGE.ACCESS_TOKEN);

		this.#cinemaData = await this.#cinemaService.getCinemaData({
			token: token,
			movieId: movieId,
		});

		this.#cinemaHall.render(this.#cinemaData.hall);
	}

	#restoreSelectedSeats() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
		this.#cinemaHall.selectSeats(seatIds);
	}

	#setOccupiedStatus() {
		const seatIds = this.#storageService.get(STORAGE.SELECTED_SEAT_IDS);
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
