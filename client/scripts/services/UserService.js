import invariant from "tiny-invariant";
import { BASE_URL, RESOURCE_URL, CLOUDINARY_URL } from "@config/constants.js";

export default class UserService {
	#apiService;

	constructor({ apiService }) {
		invariant(apiService, "UserService: apiService is not found");
		this.#apiService = apiService;
	}

	async register({ credentials }) {
		invariant(credentials, "UserService: credentials is not found");
		return this.#apiService.post({
			payload: credentials,
			resource: `${BASE_URL.PRODUCTION}/${RESOURCE_URL.REGISTER}`,
		});
	}

	async login({ credentials }) {
		invariant(credentials, "UserService: credentials is not found");
		return this.#apiService.post({
			payload: credentials,
			resource: `${BASE_URL.PRODUCTION}/${RESOURCE_URL.LOGIN}`,
		});
	}

	async getUserData({ token, userId }) {
		invariant(userId, "UserService: userId is not found");
		return this.#apiService.get({
			resource: `${BASE_URL.PRODUCTION}/${RESOURCE_URL.USERS}/${userId}`,
			token: token,
		});
	}

	async editUserData({ token, newData, userId }) {
		return this.#apiService.patch({
			resource: `${BASE_URL.PRODUCTION}/${RESOURCE_URL.USERS}/${userId}`,
			payload: newData,
			token: token,
		});
	}

	async setUserAvatar({ data }) {
		invariant(data, "UserService: data is not found");
		return this.#apiService.post({
			payload: data,
			resource: CLOUDINARY_URL,
			format: "formData",
		});
	}
}
