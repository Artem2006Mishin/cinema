import services from "@/services.js";
import { AuthError } from "@errors/AuthErrors";

export default async function isAuthenticated({ userId, token }) {
	try {
		await services.user.getUserData({
			token: token,
			userId: userId,
		});
		return true;
	} catch (error) {
		if (error instanceof AuthError) return false;
		throw error;
	}
}
