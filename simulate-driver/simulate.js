const { io } = require("socket.io-client");
const jwt = require("jsonwebtoken");

// Config
const JWT_SECRET = process.env.JWT_SECRET || "b9bcf41ecf01d47a544ee8884a0fb795acca634b918fe934e70eec9e170312f7";
const GATEWAY_URL = process.env.GATEWAY_URL || "ws://localhost:8081/driver";

// Addis Ababa default approx coordinates (Matching Passenger App default location)
const BASE_LAT = 9.005401;
const BASE_LNG = 38.763611;

// Number of mock drivers to spawn
const NUM_DRIVERS = 3;

function generateDriverToken(driverId) {
    return jwt.sign(
        {
            sub: driverId,
            id: driverId,
            role: "DRIVER",
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}

function startDriverSimulation(driverIndex) {
    const driverId = `mock-driver-${driverIndex + 1}`;
    const token = generateDriverToken(driverId);

    console.log(`[${driverId}] Connecting with token...`);

    const socket = io(GATEWAY_URL, {
        auth: {
            token: token,
        },
        transports: ["websocket"]
    });

    // Start slightly apart
    let currentLat = BASE_LAT + (Math.random() * 0.05) - 0.025;
    let currentLng = BASE_LNG + (Math.random() * 0.05) - 0.025;

    socket.on("connect", () => {
        console.log(`[${driverId}] Connected to Gateway (${socket.id})`);
        
        // Send initial location
        sendLocation(socket, driverId, currentLat, currentLng);

        // Move the driver every 5 seconds
        setInterval(() => {
            // Random walk simulation
            currentLat += (Math.random() * 0.002) - 0.001;
            currentLng += (Math.random() * 0.002) - 0.001;
            
            sendLocation(socket, driverId, currentLat, currentLng);
        }, 5000);
    });

    socket.on("connect_error", (err) => {
        console.error(`[${driverId}] Connection Error:`, err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log(`[${driverId}] Disconnected: ${reason}`);
    });
}

function sendLocation(socket, driverId, lat, lng) {
    const payload = {
        latitude: lat,
        longitude: lng,
        status: "ONLINE"
    };

    console.log(`[${driverId}] Emitting updateLocation at {lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)}}`);
    socket.emit("updateLocation", payload, (response) => {
        // Optional acknowledgment callback
        // console.log(`[${driverId}] Ack:`, response);
    });
}

console.log(`Starting mock simulation for ${NUM_DRIVERS} drivers...`);
for (let i = 0; i < NUM_DRIVERS; i++) {
    startDriverSimulation(i);
}
