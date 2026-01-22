const express = require('express');
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');
const config = require('../config');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.IMAGE_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Routes
router.get('/:imageName', imageController.getImage);
router.get('/thumbnail/:imageName', imageController.getThumbnail);
router.get('/:imageName/metadata', imageController.getMetadata);
router.post('/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;
