import invariant from "tiny-invariant";
import { HttpError, NetworkError } from "@errors/ApiErrors.js";
import {
	EmailAlreadyExistsError,
	IncorrectPasswordError,
	IncorrectEmailError,
} from "@errors/FormErrors.js";
import {
	JWTExpiredError,
	JWTMalformedError,
	MissingAuthHeaderError,
	JWTInvalidSignatureError,
} from "@errors/AuthErrors.js";

const ERRORS = {
	// auth errors
	"jwt expired": JWTExpiredError,
	"jwt malformed": JWTMalformedError,
	"Missing authorization header": MissingAuthHeaderError,
	"invalid signature": JWTInvalidSignatureError,

	// form errors
	"Email already exists": EmailAlreadyExistsError,
	"Incorrect password": IncorrectPasswordError,
	"Cannot find user": IncorrectEmailError,
};

export default class ApiService {
	async get({ resource, token }) {
		invariant(resource, "ApiService: resource is not found");

		const options = this.#buildOptions({ method: "GET", token: token });
		return this.#makeRequest(resource, options);
	}

	async post({ resource, payload, token, format }) {
		invariant(resource, "ApiService: resource is not found");
		invariant(payload, "ApiService: payload is not found");

		const options = this.#buildOptions({
			method: "POST",
			payload: payload,
			format: format,
			token: token,
		});

		return this.#makeRequest(resource, options);
	}

	async put({ resource, payload, token }) {
		invariant(resource, "ApiService: resource is not found");
		invariant(payload, "ApiService: payload is not found");

		const options = this.#buildOptions({
			method: "PUT",
			payload: payload,
			token: token,
		});
		return this.#makeRequest(resource, options);
	}

	async patch({ resource, payload, token }) {
		invariant(resource, "ApiService: resource is not found");
		invariant(payload, "ApiService: payload is not found");

		const options = this.#buildOptions({
			method: "PATCH",
			payload: payload,
			token: token,
		});
		return this.#makeRequest(resource, options);
	}

	#buildOptions({ method, payload = null, token = null, format = "json" }) {
		const options = {
			method: method,
		};

		// заголовки
		if (format === "json") {
			options.headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			};
		}

		// тело запроса
		if (payload !== null) {
			if (format === "json") {
				options.body = JSON.stringify(payload);
			} else if (format === "formData") {
				options.body = payload;
			}
		}

		return options;
	}

	#throwError(status, data) {
		if (Object.hasOwn(ERRORS, data)) {
			const Error = ERRORS[data];
			throw new Error();
		}

		throw new HttpError(status, data);
	}

	async #makeRequest(resource, options) {
		let response;

		try {
			response = await fetch(resource, options);
		} catch {
			throw new NetworkError();
		}

		const data = await response.json();

		if (!response.ok) {
			this.#throwError(response.status, data);
		}

		return data;
	}
}
