import { ERROR_NOTIFICATION_VISIBLE } from "../config/constants.js";
import { isFoundForSelector } from "../utils/checks.js";

export class ErrorNotification {
	#errorEl;

	constructor(selector = "#error-notification") {
		this.#errorEl = document.querySelector(selector);
		isFoundForSelector(this.#errorEl, selector, "ErrorNotification");
	}

	showError(text = "unknown error") {
		this.#errorEl.textContent = text;
		this.#errorEl.classList.add(ERROR_NOTIFICATION_VISIBLE);
	}

	hideError() {
		this.#errorEl.classList.remove(ERROR_NOTIFICATION_VISIBLE);
	}
}
