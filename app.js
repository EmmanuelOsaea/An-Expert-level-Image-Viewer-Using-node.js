const express = require('express');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Middleware
app.use(express.json());

// Static folder for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// API routes
app.use('/api/images', imageRoutes);

module.exports = app;
