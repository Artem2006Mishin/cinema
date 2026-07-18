import { CinemaHall } from "../components/CinemaHall.js";
import { STORAGE } from "../config/constants.js";

export class CinemaController {
	#cinemaService;
	#storageService;
	#cinemaHall;

	constructor(cinemaService, storageService) {
		this.#cinemaService = cinemaService;
		this.#storageService = storageService;
		this.#cinemaHall = new CinemaHall();
	}

	async init() {
		await this.#fetchAndRenderCinema();
	}

	async #fetchAndRenderCinema() {
		const optionId = this.#storageService.get(STORAGE.OPTION_ID);
		const cinemaData = await this.#cinemaService.getCinemaData(optionId);
		this.#cinemaHall.render(cinemaData.hall);
	}
}
