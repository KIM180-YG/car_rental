function countDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const millisecondsInOneDay = 86400000;
    return (end - start) / millisecondsInOneDay;
}

function fillCarOptions(selectedId) {
    const select = document.getElementById("car-select");
    const availableCars = cars.filter(car => car.status === "Available");

    select.innerHTML = availableCars
        .map(car => `<option value="${car.id}">${car.name} (S$${car.pricePerDay}/day)</option>`)
        .join("");

    if (availableCars.some(car => car.id === selectedId)) {
        select.value = selectedId;
    }
}

function fillLocationOptions() {
    const select = document.getElementById("pickup-location");
    select.innerHTML = `<option value="">Choose a car park</option>` + carParks
        .map(park => `<option value="${park.id}">${park.name} (${park.location})</option>`)
        .join("");
}

function updateSummary() {
    const car = findCar(document.getElementById("car-select").value);
    const pickupDate = document.getElementById("pickup-date").value;
    const returnDate = document.getElementById("return-date").value;
    const park = findCarPark(document.getElementById("pickup-location").value);

    document.getElementById("summary-img").src = car.image;
    document.getElementById("summary-img").alt = car.name;
    document.getElementById("summary-type").textContent = car.type;
    document.getElementById("summary-name").textContent = car.name;
    document.getElementById("summary-specs").textContent = `${car.range} km range · ${car.seats} seats`;
    document.getElementById("summary-rate").textContent = `S$${car.pricePerDay}`;
    document.getElementById("summary-pickup").textContent = park ? park.name : "-";

    const days = pickupDate && returnDate ? countDays(pickupDate, returnDate) : 0;
    if (days > 0) {
        document.getElementById("summary-days").textContent = days;
        document.getElementById("summary-total").textContent = `S$${days * car.pricePerDay}`;
    } else {
        document.getElementById("summary-days").textContent = "-";
        document.getElementById("summary-total").textContent = "-";
    }
}

function formatCardNumber(input) {
    const digits = input.value.replace(/\D/g, "").slice(0, 16);
    input.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(input) {
    const digits = input.value.replace(/\D/g, "").slice(0, 4);
    input.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function isExpiryValid(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
    }
    const month = Number(expiry.slice(0, 2));
    const year = 2000 + Number(expiry.slice(3));
    if (month < 1 || month > 12) {
        return false;
    }
    const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

function validateForm(form) {
    const pickupDate = form["pickup-date"].value;
    const returnDate = form["return-date"].value;
    const cardNumber = form["card-number"].value.replace(/\s/g, "");

    if (!pickupDate || !returnDate) return "Please choose your pick-up and return dates.";
    if (pickupDate < todayString()) return "The pick-up date cannot be in the past.";
    if (countDays(pickupDate, returnDate) < 1) return "The return date must be at least 1 day after pick-up.";
    if (!form["pickup-location"].value) return "Please choose a pick-up location.";
    if (form["customer-name"].value.trim().length < 2) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form["email"].value)) return "Please enter a valid email address.";
    if (!/^\d{4} ?\d{4}$/.test(form["phone"].value.trim())) return "Please enter an 8-digit phone number.";
    if (form["card-name"].value.trim().length < 2) return "Please enter the name on your card.";
    if (cardNumber.length !== 16) return "The card number must be 16 digits.";
    if (!isExpiryValid(form["card-expiry"].value)) return "Please enter a valid expiry date (MM/YY) that is not in the past.";
    if (!/^\d{3}$/.test(form["card-cvv"].value)) return "The CVV must be 3 digits.";
    return "";
}

function createBookingId(bookings) {
    const highest = bookings.reduce((max, booking) => Math.max(max, Number(booking.id.slice(2))), 1000);
    return `AZ${highest + 1}`;
}

function showConfirmation(booking) {
    const car = findCar(booking.carId);
    const park = findCarPark(booking.pickupLocation);

    document.getElementById("confirm-id").textContent = booking.id;
    document.getElementById("confirm-details").innerHTML = `
        <div><dt>Car</dt><dd>${car.name}</dd></div>
        <div><dt>Pick-up</dt><dd>${booking.pickupDate}, ${park.name}</dd></div>
        <div><dt>Return by</dt><dd>${booking.returnDate}</dd></div>
        <div><dt>Card</dt><dd>**** ${booking.cardLast4}</dd></div>
        <div class="summary-total"><dt>Rental cost</dt><dd>S$${booking.rentalCost}</dd></div>
    `;

    document.getElementById("reserve-section").hidden = true;
    document.querySelector(".page-title").hidden = true;
    document.getElementById("confirmation").hidden = false;
    window.scrollTo(0, 0);
}

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const error = validateForm(form);
    const errorBox = document.getElementById("form-error");

    if (error) {
        errorBox.textContent = error;
        return;
    }
    errorBox.textContent = "";

    const car = findCar(form["car-select"].value);
    const days = countDays(form["pickup-date"].value, form["return-date"].value);
    const bookings = getBookings();

    const booking = {
        id: createBookingId(bookings),
        carId: car.id,
        customerName: form["customer-name"].value.trim(),
        email: form["email"].value.trim(),
        phone: form["phone"].value.trim(),
        pickupDate: form["pickup-date"].value,
        returnDate: form["return-date"].value,
        pickupLocation: form["pickup-location"].value,
        days: days,
        rentalCost: days * car.pricePerDay,
        cardLast4: form["card-number"].value.replace(/\s/g, "").slice(-4),
        status: "Reserved"
    };

    bookings.push(booking);
    saveBookings(bookings);
    showConfirmation(booking);
}

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    fillCarOptions(params.get("car"));
    fillLocationOptions();

    const today = todayString();
    document.getElementById("pickup-date").min = today;
    document.getElementById("return-date").min = today;

    const form = document.getElementById("reserve-form");
    form.addEventListener("input", updateSummary);
    form.addEventListener("change", updateSummary);
    form.addEventListener("submit", handleSubmit);

    document.getElementById("card-number").addEventListener("input", function () {
        formatCardNumber(this);
    });
    document.getElementById("card-expiry").addEventListener("input", function () {
        formatExpiry(this);
    });
    document.getElementById("pickup-date").addEventListener("change", function () {
        document.getElementById("return-date").min = this.value;
    });

    updateSummary();
});
