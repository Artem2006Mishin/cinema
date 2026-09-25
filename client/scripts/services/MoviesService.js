import invariant from "tiny-invariant";
import { BASE_URL, RESOURCE_URL } from "@config/constants.js";

export default class MoviesService {
	#apiService;

	constructor({ apiService }) {
		invariant(apiService, "MoviesService: apiService is not found");
		this.#apiService = apiService;
	}

	async getMovies({ token }) {
		return this.#apiService.get({
			resource: `${BASE_URL.PRODUCTION}/${RESOURCE_URL.MOVIES}`,
			token: token,
		});
	}
}
