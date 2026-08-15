import { isFound } from "../utils/checks.js";

export class PageTransition {
	#bodyEl;
	#navigationEl;

	constructor(selector = ".navigation") {
		this.#bodyEl = document.body;

		this.#navigationEl = document.querySelector(selector);
		isFound(this.#navigationEl, selector, "PageTransition");

		this.#navigationEl.addEventListener("click", (event) => {
			this.#handleSwitch(event);
		});

		this.#revealPage();
	}

	#handleSwitch(event) {
		const link = event.target.closest("a[href]");
		if (!link) return;

		event.preventDefault();

		const href = link.getAttribute("href");
		this.#bodyEl.classList.add("load");

		window.location.href = href;
	}

	#revealPage() {
		requestAnimationFrame(() => {
			this.#bodyEl.classList.remove("load");
		});
	}
}
