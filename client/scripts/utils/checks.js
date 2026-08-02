export function isRequired(value, name, place) {
	if (value === undefined || value === null || value === "") {
		throw new Error(`${place}: ${name} is required`);
	}
}

export function isFoundForSelector(value, selector, place) {
	if (value === undefined || value === null || value === "") {
		throw new Error(`${place}: element not found for selector ${selector}`);
	}
}

export function isFound(value, name, place) {
	if (value === undefined || value === null || value === "") {
		throw new Error(`${place}: ${name} not found`);
	}
}

export function isFunction(callback, place) {
	if (typeof callback !== "function") {
		throw new Error(`${place}: callback must be a function`);
	}
}
