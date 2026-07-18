import { BASE_URL } from "../config/constants.js";

export class ApiService {
	#baseUrl;

	constructor(baseUrl = BASE_URL.DEVELOPMENT) {
		this.#baseUrl = baseUrl;
	}

	async get(resource, id = "") {
		const url = this.#buildUrl(resource, id);
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();
		return data;
	}

	async put(payload, resource, id = "") {
		const url = this.#buildUrl(resource, id);
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();
		return data;
	}

	#buildUrl(resource, id) {
		return `${this.#baseUrl}/${resource}${id ? "/" + id : ""}`;
	}
}
