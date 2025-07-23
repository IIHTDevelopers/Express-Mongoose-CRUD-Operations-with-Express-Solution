const Hotel = require('../models/hotel');

// Create a new hotel
const createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json(hotel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all hotels
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single hotel by ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a hotel by ID
const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        res.status(200).json(hotel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a hotel by ID
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel };
