export function getFromStorage(key) {
	return localStorage.getItem(key);
}

export function saveToStorage(key, value) {
	localStorage.setItem(key, value);
}
