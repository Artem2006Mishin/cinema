import invariant from "tiny-invariant";
import AuthForm from "@components/AuthForm.js";
import { STORAGE } from "@config/constants.js";
import { FormError } from "@errors/FormErrors.js";

export default class AuthController {
	#authForm;
	#authRequest; // login or register

	#userService;
	#storageService;
	#navigationService;

	constructor({
		container,
		storageService,
		userService,
		navigationService,
		authMode,
	}) {
		this.#validateInputData({
			container,
			storageService,
			userService,
			navigationService,
			authMode,
		});

		this.#storageService = storageService;
		this.#userService = userService;
		this.#navigationService = navigationService;

		if (authMode === "register") {
			this.#authRequest = this.#userService.register.bind(this.#userService);
		} else {
			this.#authRequest = this.#userService.login.bind(this.#userService);
		}

		this.#authForm = new AuthForm({
			container: container,
			formSelector: "[data-js='auth-form']",
			authMode: authMode,
		});
	}

	init() {
		this.#authForm.onSubmit(async (data) => {
			return this.#makeRequest(data);
		});
	}

	destroy() {
		this.#authForm.destroy();
	}

	#validateInputData({
		container,
		storageService,
		userService,
		navigationService,
		authMode,
	}) {
		invariant(container, "AuthController: container is not found");
		invariant(storageService, "AuthController: storageService is not found");
		invariant(userService, "AuthController: userService is not found");
		invariant(
			navigationService,
			"AuthController: navigationService is not found",
		);
		invariant(authMode, "AuthController: authMode is not found");
	}

	async #makeRequest({ confirm, ...userData }) {
		let serverError = null;

		try {
			const response = await this.#authRequest({
				credentials: userData,
			});

			this.#storageService.set(STORAGE.ACCESS_TOKEN, response.accessToken);
			this.#storageService.set(STORAGE.USER, response.user);

			this.#navigationService.navigate("/");
		} catch (error) {
			if (!(error instanceof FormError)) throw error;
			serverError = { field: error.field, message: error.message };
		}

		return serverError;
	}
}
