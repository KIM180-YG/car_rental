let currentBooking = null;

function showBooking(booking) {
    const car = findCar(booking.carId);
    const park = findCarPark(booking.returnLocation);

    document.getElementById("booking-img").src = car.image;
    document.getElementById("booking-img").alt = car.name;
    document.getElementById("booking-status").textContent = `Booking ${booking.id} · ${booking.status}`;
    document.getElementById("booking-car").textContent = car.name;
    document.getElementById("booking-details").innerHTML = `
        <div><dt>Customer</dt><dd>${booking.customerName}</dd></div>
        <div><dt>Rental</dt><dd>${booking.pickupDate} to ${booking.returnDate}</dd></div>
        <div><dt>Returned to</dt><dd>${park.name}</dd></div>
        <div><dt>Card</dt><dd>**** ${booking.cardLast4}</dd></div>
    `;
    document.getElementById("booking-card").hidden = false;
}

function createBillLines(booking, lastLabel) {
    const car = findCar(booking.carId);
    const damageLines = booking.damages
        .map(id => damageTypes.find(damage => damage.id === id))
        .map(damage => `<div><dt>${damage.name}</dt><dd>S$${damage.cost}</dd></div>`)
        .join("");

    return `
        <div><dt>Rental (${booking.days} days × S$${car.pricePerDay})</dt><dd>S$${booking.rentalCost}</dd></div>
        ${damageLines || "<div><dt>Damage</dt><dd>None</dd></div>"}
        <div class="summary-total"><dt>${lastLabel}</dt><dd>S$${booking.rentalCost + booking.damageCost}</dd></div>
    `;
}

function showBill(booking) {
    document.getElementById("bill-lines").innerHTML = createBillLines(booking, "Total to pay");
    document.getElementById("bill-notes").textContent = booking.notes ? `Staff notes: ${booking.notes}` : "";
    document.getElementById("pay-button").textContent = `Pay S$${booking.rentalCost + booking.damageCost} with card **** ${booking.cardLast4}`;
}

function handleSearch(event) {
    event.preventDefault();
    const bookingId = document.getElementById("booking-id").value.trim().toUpperCase();
    const errorBox = document.getElementById("search-error");
    const payForm = document.getElementById("pay-form");
    const booking = getBookings().find(item => item.id === bookingId);

    currentBooking = null;
    payForm.hidden = true;
    document.getElementById("booking-card").hidden = true;

    if (!booking) {
        errorBox.textContent = "No booking found with that ID.";
        return;
    }
    if (booking.status === "Paid") {
        errorBox.textContent = "This booking has already been paid. Thank you!";
        return;
    }
    if (booking.status !== "Inspected") {
        errorBox.textContent = `The final bill is not ready yet. The booking is ${booking.status}.`;
        return;
    }

    errorBox.textContent = "";
    currentBooking = booking;
    showBooking(booking);
    showBill(booking);
    payForm.hidden = false;
}

function handlePay(event) {
    event.preventDefault();
    const bookings = getBookings();
    const booking = bookings.find(item => item.id === currentBooking.id);
    booking.status = "Paid";
    booking.paidDate = todayString();
    booking.totalCost = booking.rentalCost + booking.damageCost;
    saveBookings(bookings);

    showDone(booking);
}

function showDone(booking) {
    document.getElementById("done-id").textContent = booking.id;
    document.getElementById("done-details").innerHTML = `
        <div><dt>Car</dt><dd>${findCar(booking.carId).name}</dd></div>
        <div><dt>Paid on</dt><dd>${booking.paidDate}</dd></div>
        <div><dt>Card</dt><dd>**** ${booking.cardLast4}</dd></div>
    ` + createBillLines(booking, "Total paid");

    document.querySelector(".reserve-layout").hidden = true;
    document.querySelector(".page-title").hidden = true;
    document.getElementById("pay-done").hidden = false;
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-form").addEventListener("submit", handleSearch);
    document.getElementById("pay-form").addEventListener("submit", handlePay);
});
