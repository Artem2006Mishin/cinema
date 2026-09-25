import { isFound } from "../utils/isFound.js";
import { ROUTES } from "../config/constants.js";

const ICONS_PATH = "./client/assets/icons.svg";

export class HeaderAuthIndicator {
	#linkEl;
	#iconEl;

	constructor(linkSelector, iconSelector) {
		this.#linkEl = document.querySelector(linkSelector);
		isFound(this.#linkEl, linkSelector, "HeaderAuthIndicator");

		this.#iconEl = document.querySelector(iconSelector);
		isFound(this.#iconEl, iconSelector, "HeaderAuthIndicator");
	}

	render(isAuthed) {
		const icon = isAuthed ? "profile" : "login";
		const href = isAuthed ? ROUTES.PROFILE : ROUTES.LOGIN;

		this.#iconEl.setAttribute("href", `${ICONS_PATH}#${icon}`);
		this.#linkEl.href = href;
	}
}
