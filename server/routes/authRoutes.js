import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

console.log("authRoutes loaded");

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth route working'
  });
});

router.post('/login', async (req, res) => {
  try {
    console.log("LOGIN REQUEST RECEIVED");

    const { username, password } = req.body;

    console.log("Username:", username);

    const user = await User.findOne({ username });

    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;