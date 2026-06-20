import express from 'express';
import Review from '../models/Review.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all reviews (Public: only approved, Admin with all=true: protected)
router.get('/', async (req, res) => {
  try {
    const allParam = req.query.all === 'true';
    
    if (allParam) {
      // Need JWT verification to see unapproved
      return authMiddleware(req, res, async () => {
        const reviews = await Review.find().sort({ _id: -1 });
        return res.json(reviews);
      });
    }

    const reviews = await Review.find({ approved: true }).sort({ _id: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST submit review (Public)
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const newReview = new Review({
      name: name || 'Anonymous',
      rating: Number(rating) || 5,
      comment: comment || '',
      approved: true // Default approved, admin can delete
    });
    await newReview.save();
    res.json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE review (Admin Only - Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT approve/disapprove review (Admin Only - Protected)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { approved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST reply to review (Admin Only - Protected)
router.post('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        ownerReply: {
          name: 'Owner',
          comment,
          date: 'Just now'
        }
      },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
