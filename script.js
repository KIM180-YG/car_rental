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
   showCars(filterType)
   Puts the car cards on the page.
   filterType is "All" or a car type such as "Sedan".
----------------------------------------- */
function showCars(filterType) {
    // Find the empty <div id="car-grid"> in index.html
    const grid = document.getElementById("car-grid");

    // .filter() makes a NEW array with only the cars that pass the test.
    // "car => ..." is a short way to write a function (an "arrow function").
    const list = cars.filter(car => filterType === "All" || car.type === filterType);

    // .map() turns every car into its HTML card (an array of text),
    // .join("") glues them into one long piece of text,
    // and innerHTML puts that HTML inside the div.
    grid.innerHTML = list.map(createCarCard).join("");
}


/* -----------------------------------------
   setUpFilters()
   Creates the filter buttons (All, Hatchback,
   Sedan...) and makes them work when clicked.
----------------------------------------- */
function setUpFilters() {
    const filterBar = document.getElementById("car-filters");

    // Make a list of button names: "All" first, then every car's type.
    // new Set(...) removes repeats, so two Sedans give only one "Sedan" button.
    // The ... ("spread") copies the items into the new array.
    const types = ["All", ...new Set(cars.map(car => car.type))];

    // Turn each name into a <button>. The "All" button starts highlighted.
    // data-type="Sedan" stores the type on the button so we can read it later.
    filterBar.innerHTML = types
        .map(type => `<button class="filter${type === "All" ? " active" : ""}" data-type="${type}">${type}</button>`)
        .join("");

    // Listen for clicks on the whole bar (one listener for all buttons)
    filterBar.addEventListener("click", function (event) {
        // event.target is the exact element that was clicked.
        // Ignore clicks on the gaps between buttons.
        if (event.target.tagName !== "BUTTON") return;

        // Remove the highlight from every button...
        filterBar.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
        // ...then highlight the one that was clicked
        event.target.classList.add("active");

        // Read data-type from the clicked button and redraw the cars
        showCars(event.target.dataset.type);
    });
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
    setUpFilters();
    showCars("All");
    showCarParks();
});
