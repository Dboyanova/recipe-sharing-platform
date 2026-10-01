import express from 'express';
import Recipe from '../models/Recipe.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { category, difficulty, sortBy, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'rating') sortOption = { rating: -1 };
    if (sortBy === 'views') sortOption = { views: -1 };

    const recipes = await Recipe.find(query)
      .sort(sortOption)
      .populate('author', 'username avatar')
      .populate('comments');

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username avatar').populate('comments');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, difficulty, cookingTime, servings, ingredients, instructions, tags } = req.body;

    const recipe = new Recipe({
      title,
      description,
      category,
      difficulty,
      cookingTime,
      servings,
      ingredients: JSON.parse(ingredients || '[]'),
      instructions: JSON.parse(instructions || '[]'),
      tags: JSON.parse(tags || '[]'),
      image: req.file ? req.file.path : null,
      author: req.userId
    });

    await recipe.save();
    await recipe.populate('author', 'username avatar');

    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { score } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const existingRating = recipe.ratings.find(r => r.user.toString() === req.userId);
    if (existingRating) {
      existingRating.score = score;
    } else {
      recipe.ratings.push({ user: req.userId, score });
    }

    recipe.rating = (recipe.ratings.reduce((sum, r) => sum + r.score, 0) / recipe.ratings.length).toFixed(1);
    await recipe.save();

    res.json({ message: 'Rating added successfully', rating: recipe.rating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
