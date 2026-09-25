import invariant from "tiny-invariant";

export default class NavigationService {
	#router;

	setRouter(router) {
		invariant(router, "NavigationService: router is not found");
		this.#router = router;
	}

	navigate(path) {
		invariant(path, "NavigationService: path is not found");
		this.#router.navigate(path);
	}
}
