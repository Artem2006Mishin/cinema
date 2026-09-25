import invariant from "tiny-invariant";
import { STORAGE } from "@config/constants";

export default class ProfileController {
	#storageService;
	#navigationService;
	#userService;
	#currentAvatarURL = null;

	#boundHandleLogout;
	#boundHandleUpload;

	#emailElement;
	#avatarElement;
	#logoutButton;
	#uploadButton;

	constructor({ container, storageService, navigationService, userService }) {
		this.#validateInputData({
			container,
			storageService,
			navigationService,
			userService,
		});
		this.#getDomElements(container);

		this.#storageService = storageService;
		this.#navigationService = navigationService;
		this.#userService = userService;
	}

	init() {
		this.#initUserData();

		this.#boundHandleLogout = this.#handleLogout.bind(this);
		this.#logoutButton.addEventListener("click", this.#boundHandleLogout);

		this.#boundHandleUpload = this.#handleUploadAvatar.bind(this);
		this.#uploadButton.addEventListener("change", this.#boundHandleUpload);
	}

	destroy() {
		URL.revokeObjectURL(this.#currentAvatarURL);

		this.#logoutButton.removeEventListener("click", this.#boundHandleLogout);
		this.#uploadButton.removeEventListener("change", this.#boundHandleUpload);
	}

	#validateInputData(data) {
		invariant(data, "ProfileController: data is not found");

		invariant(data.container, "ProfileController: container is not found");
		invariant(
			data.storageService,
			"ProfileController: storageService is not found",
		);
		invariant(
			data.navigationService,
			"ProfileController: navigationService is not found",
		);
		invariant(data.userService, "ProfileController: userService is not found");
	}

	#getDomElements(container) {
		invariant(container, "ProfileController: container is not found");

		this.#emailElement = container.querySelector("[data-js='profile-email']");
		invariant(
			this.#emailElement,
			"ProfileController: emailElement is not found",
		);

		this.#avatarElement = container.querySelector("[data-js='profile-avatar']");
		invariant(
			this.#avatarElement,
			"ProfileController: avatarElement is not found",
		);

		this.#logoutButton = container.querySelector("[data-js='profile-logout']");
		invariant(
			this.#logoutButton,
			"ProfileController: logoutButton is not found",
		);

		this.#uploadButton = container.querySelector("[data-js='profile-upload']");
		invariant(
			this.#uploadButton,
			"ProfileController: uploadButton is not found",
		);
	}

	#initUserData() {
		const user = this.#storageService.get(STORAGE.USER);
		invariant(user, "ProfileController: user is not found");

		this.#emailElement.textContent = user.email;
		this.#avatarElement.src = user.avatar;
	}

	#validateImageFile(file) {
		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
		const maxSize = 5 * 1024 * 1024;

		if (!allowedTypes.includes(file.type)) {
			throw new Error("Разрешены jpeg, png и webp");
		}

		if (file.size > maxSize) {
			throw new Error("Файл слишком большой (макс. 5MB)");
		}
	}

	#saveUserToStorage(response) {
		const user = {
			...this.#storageService.get(STORAGE.USER),
			avatar: response.secure_url,
		};

		this.#storageService.set(STORAGE.USER, user);
	}

	async #handleUploadAvatar(e) {
		try {
			const file = e.target.files[0];
			this.#validateImageFile(file);

			this.#currentAvatarURL = URL.createObjectURL(file);
			this.#avatarElement.src = this.#currentAvatarURL;

			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "avatars_unsigned");

			// получаю пользователя
			const userId = this.#storageService.get(STORAGE.USER).id;
			const token = this.#storageService.get(STORAGE.ACCESS_TOKEN);

			const { password, ...otherUserData } =
				await this.#userService.getUserData({
					token: token,
					userId: userId,
				});

			// загрузка на cloudinary
			const cloudinaryResponse = await this.#userService.setUserAvatar({
				data: formData,
			});

			// загрузка на json-server
			await this.#userService.editUserData({
				token: token,
				userId: userId,
				newData: {
					...otherUserData,
					avatar: cloudinaryResponse.secure_url,
				},
			});

			this.#saveUserToStorage(cloudinaryResponse);
		} catch (error) {
			console.log(error);
		}
	}

	#handleLogout() {
		this.#storageService.clear();
		this.#navigationService.navigate("/login");
	}
}
