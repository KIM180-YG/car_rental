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
        <div><dt>Returned to</dt><dd>${park.name}</dd></div>
        <div><dt>Returned on</dt><dd>${booking.returnedDate}</dd></div>
    `;
    document.getElementById("booking-card").hidden = false;
}

function createDamageOption(damage) {
    return `
        <label class="check-label">
            <input type="checkbox" name="damage" value="${damage.id}">
            ${damage.name} (S$${damage.cost})
        </label>
    `;
}

function showDamageOptions() {
    document.getElementById("damage-options").innerHTML = damageTypes.map(createDamageOption).join("");
}

function getChosenDamages() {
    const checked = document.querySelectorAll('input[name="damage"]:checked');
    return Array.from(checked).map(box => damageTypes.find(damage => damage.id === box.value));
}

function updateCharges() {
    const damages = getChosenDamages();
    const damageCost = damages.reduce((total, damage) => total + damage.cost, 0);

    document.getElementById("charge-lines").innerHTML = `
        <div><dt>Damage found</dt><dd>${damages.length}</dd></div>
        <div class="summary-total"><dt>Damage cost</dt><dd>S$${damageCost}</dd></div>
    `;
}

function handleSearch(event) {
    event.preventDefault();
    const bookingId = document.getElementById("booking-id").value.trim().toUpperCase();
    const errorBox = document.getElementById("search-error");
    const inspectForm = document.getElementById("inspect-form");
    const booking = getBookings().find(item => item.id === bookingId);

    currentBooking = null;
    inspectForm.hidden = true;
    document.getElementById("booking-card").hidden = true;
    document.getElementById("charge-lines").innerHTML = "";

    if (!booking) {
        errorBox.textContent = "No booking found with that ID.";
        return;
    }
    if (booking.status === "Reserved" || booking.status === "Rented") {
        errorBox.textContent = `This car has not been returned yet. The booking is ${booking.status}.`;
        return;
    }

    showBooking(booking);

    if (booking.status !== "Returned") {
        errorBox.textContent = `This car has already been inspected. The booking is ${booking.status}.`;
        return;
    }

    errorBox.textContent = "";
    currentBooking = booking;
    inspectForm.reset();
    inspectForm.hidden = false;
    updateCharges();
}

function handleInspect(event) {
    event.preventDefault();
    const damages = getChosenDamages();
    const bookings = getBookings();
    const booking = bookings.find(item => item.id === currentBooking.id);
    booking.status = "Inspected";
    booking.damages = damages.map(damage => damage.id);
    booking.damageCost = damages.reduce((total, damage) => total + damage.cost, 0);
    booking.notes = document.getElementById("notes").value.trim();
    saveBookings(bookings);

    showDone(booking);
}

function showDone(booking) {
    const car = findCar(booking.carId);
    const damageNames = booking.damages.map(id => damageTypes.find(damage => damage.id === id).name);

    document.getElementById("done-id").textContent = booking.id;
    document.getElementById("done-details").innerHTML = `
        <div><dt>Car</dt><dd>${car.name}</dd></div>
        <div><dt>Damage</dt><dd>${damageNames.length ? damageNames.join(", ") : "None"}</dd></div>
        <div class="summary-total"><dt>Damage cost</dt><dd>S$${booking.damageCost}</dd></div>
    `;

    document.querySelector(".reserve-layout").hidden = true;
    document.querySelector(".page-title").hidden = true;
    document.getElementById("inspect-done").hidden = false;
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", function () {
    showDamageOptions();
    const inspectForm = document.getElementById("inspect-form");
    document.getElementById("search-form").addEventListener("submit", handleSearch);
    inspectForm.addEventListener("submit", handleInspect);
    inspectForm.addEventListener("input", updateCharges);
    inspectForm.addEventListener("change", updateCharges);
});
