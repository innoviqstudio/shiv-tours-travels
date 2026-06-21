import express from 'express';
import Vehicle from '../models/Vehicle.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all vehicles (Public)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add new vehicle (Admin Only - Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.json({ success: true, vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update vehicle (Admin Only - Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE vehicle (Admin Only - Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
