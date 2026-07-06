const seatsContainer = document.querySelector(".cinema__seats");
const movies = document.querySelector("#movies");
const countSelectedSeats = document.querySelector("#count");
const totalPrice = document.querySelector("#total");

let ticketPrice = Number(movies.value);

function isFreeSeat(element) {
	return (
		element.classList.contains("seat") &&
		!element.classList.contains("seat--occupied")
	);
}

function painSeat(seat) {
	seat.classList.toggle("seat--selected");
}

function calculateCountSelectedSeats() {
	const selectedSeats = document.querySelectorAll(
		".cinema__row .seat--selected",
	);

	return selectedSeats.length;
}

function updateReceipt() {
	const count = calculateCountSelectedSeats();
	countSelectedSeats.textContent = count;

	updateTicketPrice();
	totalPrice.textContent = count * ticketPrice;
}

function updateTicketPrice() {
	ticketPrice = Number(movies.value);
}

function selectSeat(event) {
	const target = event.target;

	if (isFreeSeat(target)) {
		painSeat(target);
		updateReceipt();
	}
}

seatsContainer.addEventListener("click", selectSeat);

// ошибка: есть возможность выбрать разные места в разных фильмах
