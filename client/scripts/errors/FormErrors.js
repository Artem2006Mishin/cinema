export class FormError extends Error {
	constructor(message = "Ошибка при входе в аккаунт") {
		super(message);
		this.name = this.constructor.name;
		this.field = "unknown";
	}
}

export class EmailAlreadyExistsError extends FormError {
	constructor(message = "Такой email уже существует") {
		super(message);
		this.name = "EmailAlreadyExistsError";
		this.field = "email";
	}
}

export class IncorrectEmailError extends FormError {
	constructor(message = "Пользователь с таким email не найден") {
		super(message);
		this.name = "IncorrectEmailError";
		this.field = "email";
	}
}

export class IncorrectPasswordError extends FormError {
	constructor(message = "Неправильный пароль") {
		super(message);
		this.name = "IncorrectPasswordError";
		this.field = "password";
	}
}
