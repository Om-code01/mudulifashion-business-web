require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Missing MONGODB_URI. Create a .env file from .env.example.');
  process.exit(1);
}

if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
}
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/messages', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const savedMessage = await Message.create({ name, email, message });

    return res.status(201).json({
      message: 'Message saved successfully.',
      id: savedMessage._id
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error('Failed to save message:', error);
    return res.status(500).json({ error: 'Unable to save message right now.' });
  }
});

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Muduli Fashion website running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });
