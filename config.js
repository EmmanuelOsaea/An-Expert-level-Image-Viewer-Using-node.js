const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,

  // Directory to store original images
  IMAGE_DIR: path.join(__dirname, 'images'),

  // Directory to store generated thumbnails
  THUMBNAIL_DIR: path.join(__dirname, 'thumbnails'),

  // Thumbnail size configuration
  THUMBNAIL_WIDTH: 200,
  THUMBNAIL_HEIGHT: 200,

  // Allowed image formats (optional)
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif'],

  // Other configs can be added here
};
