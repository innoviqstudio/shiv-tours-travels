import express from 'express';
import Inquiry from '../models/Inquiry.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all contact inquiries (Admin Only - Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST submit contact message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone, and message are required' });
    }

    const newInquiry = new Inquiry({
      name,
      phone,
      email,
      message,
      createdAt: new Date()
    });

    await newInquiry.save();
    res.json({ success: true, inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
