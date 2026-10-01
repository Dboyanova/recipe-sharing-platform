import express from 'express';
import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { content, recipeId } = req.body;

    const comment = new Comment({
      content,
      author: req.userId,
      recipe: recipeId
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    const recipe = await Recipe.findById(recipeId);
    recipe.comments.push(comment._id);
    await recipe.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Recipe.findByIdAndUpdate(comment.recipe, { $pull: { comments: req.params.id } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
