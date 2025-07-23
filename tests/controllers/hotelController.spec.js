const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');  // Your Express app
const Hotel = require('../../models/hotel');  // Hotel model

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

let hotelControllerBoundaryTest = `HotelController boundary test`;

describe('Hotel Controller', () => {

    let createdHotelId;
    describe('boundary', () => {
        // Test case for creating a hotel
        it(`${hotelControllerBoundaryTest} should create a new hotel`, async () => {
            const hotelData = {
                name: 'Sunset Resort',
                location: 'California',
                price: 200,
                rooms: 50
            };

            const response = await request(app).post('/api/hotels').send(hotelData);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(hotelData.name);
            expect(response.body.location).toBe(hotelData.location);
            expect(response.body.price).toBe(hotelData.price);
            expect(response.body.rooms).toBe(hotelData.rooms);
            createdHotelId = response.body._id;  // Save the ID for use in other tests
        });

        // Test case for getting all hotels
        it(`${hotelControllerBoundaryTest} should get all hotels`, async () => {
            const response = await request(app).get('/api/hotels');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        // Test case for getting a single hotel by ID
        it(`${hotelControllerBoundaryTest} should get a hotel by ID`, async () => {
            const response = await request(app).get(`/api/hotels/${createdHotelId}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBe(createdHotelId);
            expect(response.body.name).toBe('Sunset Resort');
        });

        // Test case for getting a hotel with invalid ID
        it(`${hotelControllerBoundaryTest} should return an error for an invalid hotel ID`, async () => {
            const invalidId = 'invalid_id';
            const response = await request(app).get(`/api/hotels/${invalidId}`);

            expect(response.status).toBe(500);  // Should return a 500 error due to invalid ID format
            expect(response.body.error).toBeDefined();
        });

        // Test case for updating a hotel by ID
        it(`${hotelControllerBoundaryTest} should update a hotel by ID`, async () => {
            const updatedData = {
                name: 'Ocean View Resort',
                location: 'Hawaii',
                price: 300,
                rooms: 60
            };

            const response = await request(app).put(`/api/hotels/${createdHotelId}`).send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updatedData.name);
            expect(response.body.location).toBe(updatedData.location);
            expect(response.body.price).toBe(updatedData.price);
            expect(response.body.rooms).toBe(updatedData.rooms);
        });

        // Test case for deleting a hotel by ID
        it(`${hotelControllerBoundaryTest} should delete a hotel by ID`, async () => {
            const response = await request(app).delete(`/api/hotels/${createdHotelId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Hotel deleted');
        });

        // Test case for deleting a hotel with an invalid ID
        it(`${hotelControllerBoundaryTest} should return an error when deleting a hotel with an invalid ID`, async () => {
            const invalidId = 'invalid_id';
            const response = await request(app).delete(`/api/hotels/${invalidId}`);

            expect(response.status).toBe(500);  // Should return a 500 error due to invalid ID format
            expect(response.body.error).toBeDefined();
        });
    });
});
