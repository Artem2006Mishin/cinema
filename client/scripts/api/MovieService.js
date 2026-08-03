import { RESOURCE_URL } from "../config/constants.js";
import { isRequired } from "../utils/checks.js";

export class MovieService {
	#apiService;

	constructor(apiService) {
		isRequired(apiService, "apiService", "MovieService");
		this.#apiService = apiService;
	}

	async getMovies() {
		return await this.#apiService.get(RESOURCE_URL.MOVIES);
	}
}
