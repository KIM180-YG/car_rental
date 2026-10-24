const cars = [
    {
        id: "mg4",
        name: "MG4 Electric",
        type: "Hatchback",
        range: 435,
        seats: 5,
        pricePerDay: 80,
        image: "images/mg4.jpg",
        status: "Available"
    },
    {
        id: "atto3",
        name: "BYD Atto 3",
        type: "Compact SUV",
        range: 420,
        seats: 5,
        pricePerDay: 90,
        image: "images/atto3.jpg",
        status: "Available"
    },
    {
        id: "ioniq5",
        name: "Hyundai Ioniq 5",
        type: "Family",
        range: 480,
        seats: 5,
        pricePerDay: 120,
        image: "images/ioniq5.jpg",
        status: "Rented"
    },
    {
        id: "model3",
        name: "Tesla Model 3",
        type: "Sedan",
        range: 500,
        seats: 5,
        pricePerDay: 130,
        image: "images/model3.jpg",
        status: "Available"
    },
    {
        id: "seal",
        name: "BYD Seal",
        type: "Premium",
        range: 510,
        seats: 5,
        pricePerDay: 160,
        image: "images/seal.jpg",
        status: "Available"
    }
];

const carParks = [
    { id: "jurong",   name: "Jurong East", region: "West",       location: "JEM Basement 2",           chargers: 8 },
    { id: "orchard",  name: "Orchard",     region: "Central",    location: "ION Orchard B4",           chargers: 6 },
    { id: "bishan",   name: "Bishan",      region: "Central",    location: "Junction 8 B1",            chargers: 6 },
    { id: "tampines", name: "Tampines",    region: "East",       location: "Tampines Mall B2",         chargers: 8 },
    { id: "punggol",  name: "Punggol",     region: "North-East", location: "Waterway Point B2",        chargers: 10 }
];

const damageTypes = [
    { id: "scratch",    name: "Scratch on body",      cost: 100 },
    { id: "dent",       name: "Dent on body",         cost: 300 },
    { id: "windscreen", name: "Cracked windscreen",   cost: 500 },
    { id: "tyre",       name: "Damaged tyre or rim",  cost: 200 },
    { id: "interior",   name: "Interior stain",       cost: 80 },
    { id: "cable",      name: "Missing charging cable", cost: 250 }
];

const sampleBookings = [
    {
        id: "AZ1001",
        carId: "ioniq5",
        customerName: "Sarah Tan",
        email: "sarah.tan@example.com",
        phone: "9123 4567",
        pickupDate: "2026-10-20",
        returnDate: "2026-10-25",
        pickupLocation: "tampines",
        days: 5,
        rentalCost: 600,
        cardLast4: "4821",
        status: "Rented"
    }
];

function getBookings() {
    try {
        const saved = localStorage.getItem("azoomBookings");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {}
    return sampleBookings.slice();
}

function saveBookings(bookings) {
    try {
        localStorage.setItem("azoomBookings", JSON.stringify(bookings));
    } catch (error) {}
}

function findCar(carId) {
    return cars.find(car => car.id === carId);
}

function findCarPark(parkId) {
    return carParks.find(park => park.id === parkId);
}

function todayString() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 10);
}
