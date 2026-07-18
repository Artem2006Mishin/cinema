export class StorageService {
	#storage;

	constructor(storage = window.localStorage) {
		this.#storage = storage;
	}

	get(key) {
		const data = this.#storage.getItem(key);
		if (!data) return null;

		try {
			return JSON.parse(data);
		} catch {
			return data;
		}
	}

	set(key, value) {
		const data = typeof value === "string" ? value : JSON.stringify(value);
		this.#storage.setItem(key, data);
	}

	init(key, value) {
		if (this.get(key) === null) {
			this.set(key, value);
		}
	}

	remove(key) {
		this.#storage.removeItem(key);
	}
}
