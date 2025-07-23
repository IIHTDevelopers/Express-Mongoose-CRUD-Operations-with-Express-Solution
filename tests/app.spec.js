const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');  // Path to your Express app
const Hotel = require('../models/hotel');  // Hotel model (optional for testing)

let mongoServer;

// Start an in-memory MongoDB server before tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the in-memory MongoDB server after tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

let appControllerBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {

        // Test if the /api/hotels route is set up correctly
        it(`${appControllerBoundaryTest} should have the /api/hotels route set up`, async () => {
            const response = await request(app).get('/api/hotels');
            expect(response.status).toBe(200);  // Expect a successful response (200 OK)
        });

        // Test if the /api/hotels POST route is set up correctly
        it(`${appControllerBoundaryTest} should allow creating a hotel via POST /api/hotels`, async () => {
            const hotelData = {
                name: 'Sunset Resort',
                location: 'California',
                price: 200,
                rooms: 50
            };

            const response = await request(app).post('/api/hotels').send(hotelData);

            expect(response.status).toBe(201);  // Expect the hotel to be created (201 Created)
            expect(response.body.name).toBe(hotelData.name);
            expect(response.body.location).toBe(hotelData.location);
        });

        // Test for checking if invalid route returns 404
        it(`${appControllerBoundaryTest} should return 404 for invalid routes`, async () => {
            const response = await request(app).get('/api/invalidRoute');
            expect(response.status).toBe(404);  // Invalid route should return 404
        });
    });
});
