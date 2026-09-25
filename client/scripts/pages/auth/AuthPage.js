import invariant from "tiny-invariant";
import services from "@/services.js";
import AuthController from "@controllers/AuthController.js";
import getAuthTemplate from "@pages/auth/auth.template.js";

export default class AuthPage {
	#pageElement;
	#controller;

	constructor({ pageSelector }) {
		invariant(pageSelector, "PageLayout: pageSelector is not found");
		this.#pageElement = document.querySelector(pageSelector);
		invariant(this.#pageElement, "PageLayout: pageElement is not found");
	}

	render({ container, authMode }) {
		invariant(container, "PageLayout: container is not found");
		invariant(authMode, "PageLayout: authMode is not found");

		this.#pageElement.classList.add("page--auth");

		const template = getAuthTemplate(authMode);
		container.append(template);

		this.#controller = new AuthController({
			container: container,
			storageService: services.storage,
			userService: services.user,
			navigationService: services.navigation,
			authMode: authMode,
		});
		this.#controller.init({ mode: authMode });
	}

	destroy() {
		this.#controller?.destroy?.();
		this.#controller = null;
		this.#pageElement.classList.remove("page--auth");
	}
}
