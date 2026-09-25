export class NetworkError extends Error {
	constructor(message = "Network request failed") {
		super(message);
		this.name = "NetworkError";
	}
}

export class HttpError extends Error {
	constructor(status) {
		super(`HTTP error: ${status}`);
		this.name = "HttpError";
		this.status = status;
	}
}
