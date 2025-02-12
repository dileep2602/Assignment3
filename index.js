const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Create User API
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    logger.info('User created:', user);
    res.status(201).send(user);
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(400).send(error);
  }
});

// Update User API
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('User not found');
    logger.info('User updated:', user);
    res.send(user);
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(400).send(error);
  }
});

// Get Users API
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    logger.info('Fetched users:', users);
    res.send(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;