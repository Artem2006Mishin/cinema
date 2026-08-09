import { RESOURCE_URL } from "../config/constants.js";
import { isRequired } from "../utils/checks.js";

export class CinemaService {
	#apiService;

	constructor(apiService) {
		isRequired(apiService, "apiService", "CinemaService");
		this.#apiService = apiService;
	}

	async getCinemaData(id) {
		return this.#apiService.get(RESOURCE_URL.CINEMA, id);
	}

	async saveCinemaData(payload, id) {
		return this.#apiService.put(payload, RESOURCE_URL.CINEMA, id);
	}
}
