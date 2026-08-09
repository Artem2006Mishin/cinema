import { RESOURCE_URL } from "../config/constants.js";
import { isRequired } from "../utils/checks.js";

export class UsersService {
	#apiService;

	constructor(apiService) {
		isRequired(apiService, "apiService", "UsersService");
		this.#apiService = apiService;
	}

	async register(credentials) {
		return this.#apiService.post(credentials, RESOURCE_URL.REGISTER);
	}

	async login(credentials) {
		return this.#apiService.post(credentials, RESOURCE_URL.LOGIN);
	}
}
