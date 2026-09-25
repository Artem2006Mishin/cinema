import invariant from "tiny-invariant";
import profile from "@/assets/profile.jpg";
import PasswordVisibilityToggle from "@components/PasswordVisibilityToggle.js";

const ERROR_SELECTORS = {
	email: "[data-js='email-error']",
	password: "[data-js='password-error']",
	confirm: "[data-js='confirm-error']",
};

export default class AuthForm {
	#formElement;
	#authMode;
	#passwordVisibilityToggles;

	#onSubmit;
	#boundHandleSubmit;

	constructor({ container, formSelector, authMode }) {
		invariant(container, "AuthForm: container is not found");
		invariant(formSelector, "AuthForm: formSelector is not found");
		invariant(authMode, "AuthForm: authMode is not found");

		this.#formElement = container.querySelector(formSelector);
		invariant(this.#formElement, "AuthForm: formElement is not found");

		this.#authMode = authMode;

		this.#boundHandleSubmit = this.#handleSubmit.bind(this);
		this.#formElement.addEventListener("submit", this.#boundHandleSubmit);

		this.#initToggles(container);
	}

	destroy() {
		this.#onSubmit = null;
		this.#formElement.removeEventListener("submit", this.#boundHandleSubmit);
		this.#passwordVisibilityToggles.forEach((toggle) => toggle.destroy());
	}

	onSubmit(callback) {
		invariant(callback, "AuthForm: callback is not found");
		this.#onSubmit = callback;
	}

	#initToggles(container) {
		const config = [
			{
				input: "[data-js='password-input']",
				toggle: "[data-js='password-toggle']",
				icon: "[data-js='password-icon']",
			},
		];

		if (this.#authMode === "register") {
			config.push({
				input: "[data-js='confirm-input']",
				toggle: "[data-js='confirm-toggle']",
				icon: "[data-js='confirm-icon']",
			});
		}

		this.#passwordVisibilityToggles = config.map((toggle) => {
			return new PasswordVisibilityToggle({
				container: container,
				inputSelector: toggle.input,
				toggleSelector: toggle.toggle,
				iconSelector: toggle.icon,
			});
		});
	}

	#showError({ field, message }) {
		const errorElement = this.#formElement.querySelector(
			ERROR_SELECTORS[field],
		);

		errorElement.classList.add("field__error--visible");
		errorElement.textContent = message;
	}

	#hideError({ field }) {
		const errorElement = this.#formElement.querySelector(
			ERROR_SELECTORS[field],
		);

		errorElement.classList.remove("field__error--visible");
		errorElement.textContent = "";
	}

	#validateForm(fields) {
		const errors = {
			email: this.#getEmailError(fields.email),
			password: this.#getPasswordError(fields.password),
		};

		if (this.#authMode === "register") {
			errors["confirm"] = this.#getConfirmError(
				fields.password,
				fields["confirm"],
			);
		}

		this.#displayErrors(errors);
		return Object.values(errors).every((error) => error === null);
	}

	#getEmailError(email) {
		if (email.trim() === "") return "Введите email";

		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!regex.test(email)) return "Неправильный email";

		return null;
	}

	#getPasswordError(password) {
		if (password.trim() === "") return "Введите пароль";
		if (password.length < 6) return "Пароль слишком короткий";
		return null;
	}

	#getConfirmError(password, confirm) {
		if (confirm.trim() === "") return "Введите пароль ещё раз";
		if (password !== confirm) return "Пароли не совпадают";
		return null;
	}

	#displayErrors(errors) {
		for (const [field, message] of Object.entries(errors)) {
			if (message) {
				this.#showError({ field, message });
			} else {
				this.#hideError({ field });
			}
		}
	}

	async #handleSubmit(event) {
		event.preventDefault();

		const formData = new FormData(this.#formElement);
		const data = Object.fromEntries(formData);

		const isValid = this.#validateForm(data);
		if (!isValid) return;

		data.avatar = profile;

		const serverError = await this.#onSubmit(data);
		if (serverError !== null) {
			this.#showError({
				field: serverError.field,
				message: serverError.message,
			});
		}
	}
}
