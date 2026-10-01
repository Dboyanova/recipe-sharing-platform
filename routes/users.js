import express from 'express';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipes = await Recipe.find({ author: user._id });

    res.json({
      user,
      recipeCount: recipes.length,
      recipes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, bio, avatar, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/favorites/add', authenticate, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.userId);

    if (!user.favoriteRecipes.includes(recipeId)) {
      user.favoriteRecipes.push(recipeId);
      await user.save();
    }

    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/favorites/remove', authenticate, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.userId);

    user.favoriteRecipes = user.favoriteRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favoriteRecipes');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.favoriteRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
