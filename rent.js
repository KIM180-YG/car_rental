let currentBooking = null;

function showBooking(booking) {
    const car = findCar(booking.carId);
    const park = findCarPark(booking.pickupLocation);

    document.getElementById("booking-img").src = car.image;
    document.getElementById("booking-img").alt = car.name;
    document.getElementById("booking-status").textContent = `Booking ${booking.id} · ${booking.status}`;
    document.getElementById("booking-car").textContent = car.name;
    document.getElementById("booking-details").innerHTML = `
        <div><dt>Customer</dt><dd>${booking.customerName}</dd></div>
        <div><dt>Mobile</dt><dd>${booking.phone}</dd></div>
        <div><dt>Pick-up</dt><dd>${booking.pickupDate}, ${park.name}</dd></div>
        <div><dt>Return by</dt><dd>${booking.returnDate}</dd></div>
        <div><dt>Card</dt><dd>**** ${booking.cardLast4}</dd></div>
        <div class="summary-total"><dt>Rental cost</dt><dd>S$${booking.rentalCost}</dd></div>
    `;
    document.getElementById("booking-card").hidden = false;
}

function handleSearch(event) {
    event.preventDefault();
    const bookingId = document.getElementById("booking-id").value.trim().toUpperCase();
    const errorBox = document.getElementById("search-error");
    const rentForm = document.getElementById("rent-form");
    const booking = getBookings().find(item => item.id === bookingId);

    currentBooking = null;
    rentForm.hidden = true;
    document.getElementById("booking-card").hidden = true;

    if (!booking) {
        errorBox.textContent = "No booking found with that ID.";
        return;
    }

    showBooking(booking);

    if (booking.status !== "Reserved") {
        errorBox.textContent = `This car has already been collected. The booking is ${booking.status}.`;
        return;
    }

    errorBox.textContent = "";
    currentBooking = booking;
    rentForm.hidden = false;
}

function handleRent(event) {
    event.preventDefault();
    const errorBox = document.getElementById("rent-error");

    if (!document.getElementById("check-licence").checked) {
        errorBox.textContent = "Please check the customer's driving licence.";
        return;
    }
    if (!document.getElementById("check-card").checked) {
        errorBox.textContent = "Please check that the payment card matches.";
        return;
    }
    errorBox.textContent = "";

    const bookings = getBookings();
    const booking = bookings.find(item => item.id === currentBooking.id);
    booking.status = "Rented";
    booking.collectedDate = todayString();
    saveBookings(bookings);

    showDone(booking);
}

function showDone(booking) {
    const car = findCar(booking.carId);

    document.getElementById("done-id").textContent = booking.id;
    document.getElementById("done-details").innerHTML = `
        <div><dt>Car</dt><dd>${car.name}</dd></div>
        <div><dt>Customer</dt><dd>${booking.customerName}</dd></div>
        <div><dt>Collected</dt><dd>${booking.collectedDate}</dd></div>
        <div><dt>Return by</dt><dd>${booking.returnDate}</dd></div>
    `;

    document.querySelector(".reserve-layout").hidden = true;
    document.querySelector(".page-title").hidden = true;
    document.getElementById("rent-done").hidden = false;
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-form").addEventListener("submit", handleSearch);
    document.getElementById("rent-form").addEventListener("submit", handleRent);
});
