import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['air-fryer', 'multicooker'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  cookingTime: {
    type: Number,
    required: true,
    description: 'in minutes'
  },
  servings: {
    type: Number,
    default: 4
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: [{
    step: Number,
    description: String
  }],
  tags: [String],
  image: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    user: mongoose.Schema.Types.ObjectId,
    score: Number
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Recipe', RecipeSchema);
