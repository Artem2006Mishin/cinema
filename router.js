import Navigo from "navigo";

import ProfilePage from "@pages/profile/ProfilePage.js";
import HomePage from "@pages/home/HomePage.js";
import AuthPage from "@pages/auth/AuthPage.js";

import services from "@/services.js";
import isAuthenticated from "@utils/isAuthenticated.js";
import { STORAGE } from "@config/constants.js";
import {
	getSidebarTemplate,
	getFooterTemplate,
} from "@layouts/pageLayout.template.js";

const PUBLIC_ROUTES = ["cinema/login", "cinema/register"];

export default function createRouter() {
	const router = new Navigo("/cinema");
	const container = document.querySelector("[data-js='page-main']");
	let currentPage = null;

	services.navigation.setRouter(router);

	router.hooks({
		async before(done, match) {
			const user = services.storage.get(STORAGE.USER);

			const isPublic = PUBLIC_ROUTES.includes(match.route.path);

			// клиентская проверка
			if (!user) {
				if (!isPublic) {
					router.navigate("/login");
					return done(false);
				}

				return done();
			}

			// серверная проверка

			const token = services.storage.get(STORAGE.ACCESS_TOKEN);
			const isAuthed = await isAuthenticated({ token: token, userId: user.id });

			if (!isAuthed && !isPublic) {
				router.navigate("/login");
				return done(false);
			}

			if (isAuthed && isPublic) {
				router.navigate("/");
				return done(false);
			}

			done();
		},
	});

	async function mount({ PageClass, ...options } = {}) {
		try {
			const fragment = document.createDocumentFragment();

			const sidebarTemplate = getSidebarTemplate();
			fragment.append(sidebarTemplate);

			const nextPage = new PageClass({ pageSelector: "[data-js='page']" });
			await nextPage.render({ container: fragment, ...options });

			const footerTemplate = getFooterTemplate();
			fragment.append(footerTemplate);

			currentPage?.destroy();
			container.replaceChildren(fragment);
			currentPage = nextPage;
		} catch (error) {
			console.error(error.message);
		}
	}

	router
		.on("/", () => {
			return mount({
				PageClass: HomePage,
			});
		})
		.on("/login", () => {
			return mount({
				PageClass: AuthPage,
				authMode: "login",
			});
		})
		.on("/register", () => {
			return mount({
				PageClass: AuthPage,
				authMode: "register",
			});
		})
		.on("/profile", () => {
			return mount({
				PageClass: ProfilePage,
			});
		})
		.resolve();
}
