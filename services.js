import StorageService from "@services/StorageService.js";
import ApiService from "@services/ApiService.js";
import UserService from "@services/UserService.js";
import NavigationService from "@services/NavigationService.js";
import MoviesService from "@services/MoviesService.js";
import CinemaService from "@services/CinemaService.js";

const apiService = new ApiService();

const services = {
	storage: new StorageService(),
	api: apiService,
	user: new UserService({ apiService: apiService }),
	navigation: new NavigationService(),
	movies: new MoviesService({ apiService: apiService }),
	cinema: new CinemaService({ apiService: apiService }),
};

export default services;
