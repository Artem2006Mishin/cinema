import { RESOURCE_URL } from "../config/constants.js";

export class MovieService {
	#apiService;

	constructor(apiService) {
		this.#apiService = apiService;
	}

	async getMovies() {
		return await this.#apiService.get(RESOURCE_URL.MOVIES);
	}
}
