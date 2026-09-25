import invariant from "tiny-invariant";
import services from "@/services";
import getProfileTemplate from "@pages/profile/profile.template.js";
import ProfileController from "@controllers/ProfileController.js";

export default class ProfilePage {
	#controller;

	render({ container }) {
		invariant(container, "ProfilePage: container is not found");

		const template = getProfileTemplate();
		container.append(template);

		this.#controller = new ProfileController({
			container: container,
			storageService: services.storage,
			navigationService: services.navigation,
			userService: services.user
		});
		this.#controller.init();
	}

	destroy() {
		this.#controller.destroy();
		this.#controller = null;
	}
}
