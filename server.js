import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-platform')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.log('✗ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recipe Platform API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
