export function getFromStorage(key) {
	return localStorage.getItem(key);
}

export function saveToStorage(key, value) {
	localStorage.setItem(key, value);
}

export function initStorage(key, value) {
	const isEmpty = !getFromStorage(key);
	if (isEmpty) {
		saveToStorage(key, value);
	}
}
