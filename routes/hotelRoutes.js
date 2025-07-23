const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// POST route for creating a hotel
router.post('/hotels', hotelController.createHotel);

// GET route for getting all hotels
router.get('/hotels', hotelController.getAllHotels);

// GET route for getting a single hotel by ID
router.get('/hotels/:id', hotelController.getHotelById);

// PUT route for updating a hotel by ID
router.put('/hotels/:id', hotelController.updateHotel);

// DELETE route for deleting a hotel by ID
router.delete('/hotels/:id', hotelController.deleteHotel);

module.exports = router;
