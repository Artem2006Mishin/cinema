import { BASE_URL, STORAGE } from "../config/constants.js";
import { HttpError, NetworkError } from "../errors/ApiErrors.js";
import { isRequired } from "../utils/checks.js";

export class ApiService {
	#baseUrl;
	#storageService;

	constructor(storageService, baseUrl = BASE_URL.DEVELOPMENT) {
		isRequired(storageService, "storageService", "ApiService");

		this.#baseUrl = baseUrl;
		this.#storageService = storageService;
	}

	async get(resource, id = "") {
		isRequired(resource, "resource", "ApiService");

		const url = this.#buildUrl(resource, id);
		const options = this.#buildOptions("GET");

		return this.#makeRequest(url, options);
	}

	async post(payload, resource) {
		isRequired(payload, "payload", "ApiService");
		isRequired(resource, "resource", "ApiService");

		const url = this.#buildUrl(resource);
		const options = this.#buildOptions("POST", payload);

		return this.#makeRequest(url, options);
	}

	async put(payload, resource, id = "") {
		isRequired(payload, "payload", "ApiService");
		isRequired(resource, "resource", "ApiService");

		const url = this.#buildUrl(resource, id);
		const options = this.#buildOptions("PUT", payload);

		return this.#makeRequest(url, options);
	}

	#buildUrl(resource, id) {
		return `${this.#baseUrl}/${resource}${id ? "/" + id : ""}`;
	}

	#buildOptions(method, payload = null) {
		const options = {
			method: method,
			headers: this.#buildHeaders(),
		};

		if (payload !== null) {
			options.body = JSON.stringify(payload);
		}

		return options;
	}

	#buildHeaders() {
		const headers = {
			"Content-Type": "application/json",
		};

		const accessToken = this.#storageService.get(STORAGE.ACCESS_TOKEN);
		if (accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		return headers;
	}

	async #makeRequest(url, options) {
		let response;

		try {
			response = await fetch(url, options);
		} catch {
			throw new NetworkError();
		}

		if (!response.ok) {
			throw new HttpError(response.status);
		}

		return response.json();
	}
}
