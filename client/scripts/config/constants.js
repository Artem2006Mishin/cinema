export const BASE_URL = {
	DEVELOPMENT: "http://localhost:3000",
	PRODUCTION: import.meta.env.VITE_API_URL,
};

export const RESOURCE_URL = {
	MOVIES: "movies",
	CINEMA: "cinema",
	REGISTER: "register",
	LOGIN: "login",
	USERS: "users",
};

export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

export const STORAGE = {
	MOVIE_ID: "movieId",
	SELECTED_SEAT_IDS: "selectedSeatIds",
	ACCESS_TOKEN: "accessToken",
	USER: "user",
};

export const SEAT_STATUS = {
	FREE: "free",
	SELECTED: "selected",
	OCCUPIED: "occupied",
};

export const ERROR_NOTIFICATION_VISIBLE = "error-notification--visible";

export const ROUTES = {
	HOME: "./index.html",
	LOGIN: "./client/scripts/pages/login/login.html",
	PROFILE: "./client/scripts/pages/profile/profile.html",
};
