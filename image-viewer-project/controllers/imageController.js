const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const config = require('../config');

// Helper to check if file exists
const fileExists = (filePath) => fs.existsSync(filePath);

// Serve original image
exports.getImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(config.IMAGE_DIR, imageName);

  if (!fileExists(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  res.sendFile(imagePath);
};

// Serve or generate thumbnail
exports.getThumbnail = async (req, res) => {
  const imageName = req.params.imageName;
  const thumbPath = path.join(config.THUMBNAIL_DIR, imageName);
  const imagePath = path.join(config.IMAGE_DIR, imageName);

  if (!fileExists(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  try {
    if (fileExists(thumbPath)) {
      // Serve cached thumbnail
      return res.sendFile(thumbPath);
    }

    // Generate thumbnail
    await sharp(imagePath)
      .resize(config.THUMBNAIL_WIDTH, config.THUMBNAIL_HEIGHT, { fit: 'inside' })
      .toFile(thumbPath);

    res.sendFile(thumbPath);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
};

// Get image metadata
exports.getMetadata = async (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(config.IMAGE_DIR, imageName);

  if (!fileExists(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  try {
    const metadata = await sharp(imagePath).metadata();
    res.json(metadata);
  } catch (error) {
    console.error('Error reading metadata:', error);
    res.status(500).json({ error: 'Failed to read metadata' });
  }
};

// Handle image upload (optional)
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // File is saved by multer middleware (configured in routes)
  res.status(201).json({ message: 'Image uploaded successfully', fileName: req.file.filename });
};
