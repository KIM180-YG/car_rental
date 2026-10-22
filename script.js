/* =========================================
   AZoom EV - homepage script
   Builds the car cards and car park cards
   from the arrays in data.js
========================================= */


/* -----------------------------------------
   createCarCard(car)
   Takes ONE car object from the cars array
   and returns the HTML for its card as text.
----------------------------------------- */
function createCarCard(car) {
    // true if this car's status is "Available", false otherwise
    const isAvailable = car.status === "Available";

    // Choose which button to show
    let button;
    if (isAvailable) {
        // A link to the reserve page. "?car=mg4" tells that page
        // which car was clicked (we use it in Step 3).
        button = `<a href="reserve.html?car=${car.id}" class="btn btn-small">Rent now</a>`;
    } else {
        // A grey, unclickable label for cars that are already rented
        button = `<span class="btn btn-small btn-disabled">Not available</span>`;
    }

    // Backticks ` ` make a "template literal": text that can span many lines.
    // Anything inside ${ } is replaced by its value,
    // e.g. ${car.name} becomes "MG4 Electric".
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
    // Note: condition ? A : B means "if condition is true use A, else use B".
    // It gives the status label the class "available" (green) or "rented" (red).
}


/* -----------------------------------------
   createCarParkCard(park)
   Same idea as createCarCard, but for one
   car park object from the carParks array.
----------------------------------------- */
function createCarParkCard(park) {
    return `
        <article class="carpark">
            <h3>${park.name}</h3>
            <p>${park.region} &middot; ${park.location}</p>
            <p class="chargers">${park.chargers} chargers</p>
        </article>
    `;
}


/* -----------------------------------------
   showCars()
   Puts all the car cards on the page.
----------------------------------------- */
function showCars() {
    // Find the empty <div id="car-grid"> in index.html
    const grid = document.getElementById("car-grid");

    // .map() turns every car into its HTML card (an array of text),
    // .join("") glues them into one long piece of text,
    // and innerHTML puts that HTML inside the div.
    grid.innerHTML = cars.map(createCarCard).join("");
}


/* -----------------------------------------
   showCarParks()
   Puts all the car park cards on the page.
----------------------------------------- */
function showCarParks() {
    const grid = document.getElementById("carpark-grid");
    grid.innerHTML = carParks.map(createCarParkCard).join("");
}


/* -----------------------------------------
   Start here!
   "DOMContentLoaded" fires when the browser has
   finished reading the HTML, so the empty divs
   exist and we can fill them.
----------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    showCars();
    showCarParks();
});
