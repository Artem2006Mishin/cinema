import invariant from "tiny-invariant";
import { BASE_URL, RESOURCE_URL } from "@config/constants.js";

export default class CinemaService {
	#apiService;

	constructor({ apiService }) {
		invariant(apiService, "UserService: apiService is not found");
		this.#apiService = apiService;
	}

	async getCinemaData({ token, movieId }) {
		return this.#apiService.get({
			resource: `${BASE_URL.DEVELOPMENT}/${RESOURCE_URL.CINEMA}/${movieId}`,
			token: token,
		});
	}

	async saveCinemaData({ token, payload, movieId }) {
		return this.#apiService.put({
			resource: `${BASE_URL.DEVELOPMENT}/${RESOURCE_URL.CINEMA}/${movieId}`,
			payload: payload,
			token: token,
		});
	}
}
