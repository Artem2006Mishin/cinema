import { BASE_URL } from "../config/constants.js";
import { HttpError, NetworkError } from "../errors/ApiErrors.js";
import { isRequired } from "../utils/checks.js";

export class ApiService {
	#baseUrl;

	constructor(baseUrl = BASE_URL.PRODUCTION) {
		this.#baseUrl = baseUrl;
	}

	async get(resource, id = "") {
		isRequired(resource, "resource", "ApiService");
		const url = this.#buildUrl(resource, id);
		return this.#makeRequest(url);
	}

	async put(payload, resource, id = "") {
		isRequired(payload, "payload", "ApiService");
		isRequired(resource, "resource", "ApiService");

		const url = this.#buildUrl(resource, id);
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		};

		return this.#makeRequest(url, options);
	}

	#buildUrl(resource, id) {
		return `${this.#baseUrl}/${resource}${id ? "/" + id : ""}`;
	}

	async #makeRequest(url, options = null) {
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
