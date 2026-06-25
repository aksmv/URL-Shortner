require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { router: linksRouter, redirectRouter } = require('./routes/links');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener';

app.use(cors());
app.use(express.json());

// Basic rate limiting on link creation to prevent abuse
const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many links created. Please slow down.' },
});

app.use('/api/links', (req, res, next) => {
  if (req.method === 'POST') return createLimiter(req, res, next);
  return next();
});
app.use('/api', linksRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Redirect routes mounted at root so /:shortCode works, but after /api so it doesn't shadow it
app.use('/', redirectRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
