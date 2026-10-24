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
        <div><dt>Picked up</dt><dd>${booking.pickupDate}, ${park.name}</dd></div>
        <div><dt>Return by</dt><dd>${booking.returnDate}</dd></div>
    `;
    document.getElementById("booking-card").hidden = false;
}

function createParkOption(park) {
    return `
        <label class="park-option">
            <input type="radio" name="return-park" value="${park.id}">
            <strong>${park.name}</strong>
            <span>${park.location}</span>
            <span class="chargers">${park.chargers} chargers</span>
        </label>
    `;
}

function showParkOptions() {
    document.getElementById("park-options").innerHTML = carParks.map(createParkOption).join("");
}

function handleSearch(event) {
    event.preventDefault();
    const bookingId = document.getElementById("booking-id").value.trim().toUpperCase();
    const errorBox = document.getElementById("search-error");
    const returnForm = document.getElementById("return-form");
    const booking = getBookings().find(item => item.id === bookingId);

    currentBooking = null;
    returnForm.hidden = true;
    document.getElementById("booking-card").hidden = true;

    if (!booking) {
        errorBox.textContent = "No booking found with that ID.";
        return;
    }

    showBooking(booking);

    if (booking.status === "Reserved") {
        errorBox.textContent = "This car has not been collected yet.";
        return;
    }
    if (booking.status !== "Rented") {
        errorBox.textContent = `This car has already been returned. The booking is ${booking.status}.`;
        return;
    }

    errorBox.textContent = "";
    currentBooking = booking;
    returnForm.hidden = false;
}

function handleReturn(event) {
    event.preventDefault();
    const errorBox = document.getElementById("return-error");
    const chosen = document.querySelector('input[name="return-park"]:checked');

    if (!chosen) {
        errorBox.textContent = "Please choose the car park where you left the car.";
        return;
    }
    errorBox.textContent = "";

    const bookings = getBookings();
    const booking = bookings.find(item => item.id === currentBooking.id);
    booking.status = "Returned";
    booking.returnLocation = chosen.value;
    booking.returnedDate = todayString();
    saveBookings(bookings);

    showDone(booking);
}

function showDone(booking) {
    const car = findCar(booking.carId);
    const park = findCarPark(booking.returnLocation);

    document.getElementById("done-id").textContent = booking.id;
    document.getElementById("done-details").innerHTML = `
        <div><dt>Car</dt><dd>${car.name}</dd></div>
        <div><dt>Returned to</dt><dd>${park.name}, ${park.location}</dd></div>
        <div><dt>Returned on</dt><dd>${booking.returnedDate}</dd></div>
    `;

    document.querySelector(".reserve-layout").hidden = true;
    document.querySelector(".page-title").hidden = true;
    document.getElementById("return-done").hidden = false;
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", function () {
    showParkOptions();
    document.getElementById("search-form").addEventListener("submit", handleSearch);
    document.getElementById("return-form").addEventListener("submit", handleReturn);
    document.getElementById("park-options").addEventListener("change", function () {
        document.getElementById("return-error").textContent = "";
    });
});
