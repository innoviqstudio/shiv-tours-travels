import express from 'express';
import Package from '../models/Package.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all packages (Public)
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add new package (Admin Only - Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.json({ success: true, package: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT edit package (Admin Only - Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const packageData = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }
    res.json({ success: true, package: packageData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE package (Admin Only - Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }
    res.json({ success: true, message: 'Tour package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
