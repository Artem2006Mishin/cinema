export default function isFound({ value, name, place }) {
	if (value === undefined || value === null || value === "") {
		throw new Error(`${place}: ${name} not found`);
	}
}
