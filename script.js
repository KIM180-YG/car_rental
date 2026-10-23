function createCarCard(car) {
    const isAvailable = car.status === "Available";

    let button;
    if (isAvailable) {
        button = `<a href="reserve.html?car=${car.id}" class="btn btn-small">Rent now</a>`;
    } else {
        button = `<span class="btn btn-small btn-disabled">Not available</span>`;
    }

    return `
        <article class="car">
            <img src="${car.image}" alt="${car.name}" class="car-img">
            <p class="car-type">${car.type}</p>
            <h3>${car.name}</h3>
            <p class="car-specs">${car.range} km range &middot; ${car.seats} seats</p>
            <p class="status ${isAvailable ? "available" : "rented"}">${car.status}</p>
            <p class="car-price">From <strong>S$${car.pricePerDay}</strong>/day</p>
            ${button}
        </article>
    `;
}

function createCarParkCard(park) {
    return `
        <article class="carpark">
            <h3>${park.name}</h3>
            <p>${park.region} &middot; ${park.location}</p>
            <p class="chargers">${park.chargers} chargers</p>
        </article>
    `;
}

function showCars() {
    const grid = document.getElementById("car-grid");
    grid.innerHTML = cars.map(createCarCard).join("");
}

function showCarParks() {
    const grid = document.getElementById("carpark-grid");
    grid.innerHTML = carParks.map(createCarParkCard).join("");
}

document.addEventListener("DOMContentLoaded", function () {
    showCars();
    showCarParks();
});
