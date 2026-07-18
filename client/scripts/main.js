import { ApiService } from "./api/ApiService.js";
import { MovieService } from "./api/MovieService.js";
import { CinemaService } from "./api/CinemaService.js";
import { StorageService } from "./storage/StorageService.js";
import { MoviesController } from "./controllers/MoviesController.js";
import { CinemaController } from "./controllers/CinemaController.js";

const apiService = new ApiService();
const movieService = new MovieService(apiService);
const cinemaService = new CinemaService(apiService);
const storageService = new StorageService();

const moviesController = new MoviesController(movieService, storageService);
const cinemaController = new CinemaController(cinemaService, storageService);

await moviesController.init();
await cinemaController.init();

// ловить ошибку когда нет интернета
// сделать сохраниение в LS выделенных мест
