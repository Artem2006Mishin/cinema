import invariant from "tiny-invariant";

export default class PasswordVisibilityToggle {
	#inputElement;
	#toggleElement;
	#iconElement;

	#boundOpenEye;
	#boundCloseEye;

	constructor(options) {
		this.#validateInputData(options);
		this.#init(options);
		this.#bindEvents();
	}

	destroy() {
		this.#toggleElement.removeEventListener("pointerdown", this.#boundOpenEye);
		this.#toggleElement.removeEventListener("pointerup", this.#boundCloseEye);
		this.#toggleElement.removeEventListener(
			"pointerleave",
			this.#boundCloseEye,
		);
	}

	#validateInputData({
		container,
		inputSelector,
		toggleSelector,
		iconSelector,
	}) {
		invariant(container, "PasswordVisibilityToggle: container is not found");

		invariant(
			inputSelector,
			"PasswordVisibilityToggle: inputSelector is not found",
		);

		invariant(
			toggleSelector,
			"PasswordVisibilityToggle: toggleSelector is not found",
		);

		invariant(
			iconSelector,
			"PasswordVisibilityToggle: iconSelector is not found",
		);
	}

	#init({ container, inputSelector, toggleSelector, iconSelector }) {
		this.#inputElement = container.querySelector(inputSelector);
		invariant(
			this.#inputElement,
			"PasswordVisibilityToggle: inputElement is not found",
		);

		this.#toggleElement = container.querySelector(toggleSelector);
		invariant(
			this.#toggleElement,
			"PasswordVisibilityToggle: toggleElement is not found",
		);

		this.#iconElement = container.querySelector(iconSelector);
		invariant(
			this.#iconElement,
			"PasswordVisibilityToggle: iconElement is not found",
		);
	}

	#bindEvents() {
		this.#boundOpenEye = this.#openEye.bind(this);
		this.#toggleElement.addEventListener("pointerdown", this.#boundOpenEye);

		this.#boundCloseEye = this.#closeEye.bind(this);
		this.#toggleElement.addEventListener("pointerup", this.#boundCloseEye);
		this.#toggleElement.addEventListener("pointerleave", this.#boundCloseEye);
	}

	#openEye() {
		this.#inputElement.type = "text";
		this.#iconElement.setAttribute("href", "./icons.svg#eye");
	}

	#closeEye() {
		this.#inputElement.type = "password";
		this.#iconElement.setAttribute("href", "./icons.svg#eye-closed");
	}
}
