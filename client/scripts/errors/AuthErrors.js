export class AuthError extends Error {
	constructor(message = "Ошибка аутентификации") {
		super(message);
		this.name = this.constructor.name;
	}
}

export class JWTExpiredError extends AuthError {
	constructor(message = "Срок действия JWT-токена истек") {
		super(message);
	}
}

export class JWTMalformedError extends AuthError {
	constructor(message = "JWT-токен повреждён или имеет неверный формат") {
		super(message);
	}
}

export class MissingAuthHeaderError extends AuthError {
	constructor(message = "Отсутствует заголовок авторизации") {
		super(message);
	}
}

export class JWTInvalidSignatureError extends AuthError {
	constructor(message = "Недействительная подпись JWT-токена") {
		super(message);
	}
}
