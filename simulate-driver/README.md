# Driver Simulation Script
This script helps you test the passenger application when you only have one physical mobile device. It simulates 3 nearby drivers connecting to the API Gateway using WebSockets and emitting real-time location updates.

## How to use:
1. Make sure your local backend microservices (`platform-api-gateway`, `platform-location-service`, Kafka, Redis) are running.
2. Open a terminal and navigate to this folder:
   ```bash
   cd scripts/simulate-driver
   ```
3. Install the required Node.js dependencies (only needed the first time):
   ```bash
   npm install
   ```
4. Start the simulation script:
   ```bash
   npm start
   ```

You will see logs of drivers connecting and emitting locations. If you open your Passenger App and its location falls roughly in the center of Addis Ababa (around Latitude: 8.9806, Longitude: 38.7578), you should see the 3 simulated car marker icons moving slightly every 5 seconds.

**Note:** If you want the cars to spawn closer to your actual current location, open `simulate.js` and change `BASE_LAT` and `BASE_LNG` at the top of the file to your exact coordinates.
