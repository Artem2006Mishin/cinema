import { isRequired } from "../utils/checks.js";

export class StorageService {
	#storage;

	constructor(storage = window.localStorage) {
		this.#storage = storage;
	}

	get(key) {
		isRequired(key, "key", "StorageService.get");
		const data = this.#storage.getItem(key);

		try {
			return JSON.parse(data);
		} catch {
			return data;
		}
	}

	set(key, value) {
		isRequired(key, "key", "StorageService.set");
		isRequired(value, "value", "StorageService.set");

		const data = typeof value === "string" ? value : JSON.stringify(value);
		this.#storage.setItem(key, data);
	}

	init(key, value) {
		isRequired(key, "key", "StorageService.init");
		isRequired(value, "value", "StorageService.init");

		if (this.get(key) === null) {
			this.set(key, value);
		}
	}

	remove(key) {
		isRequired(key, "key", "StorageService.remove");
		this.#storage.removeItem(key);
	}
}
