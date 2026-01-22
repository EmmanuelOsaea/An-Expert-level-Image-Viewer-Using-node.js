import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/images';

const imageService = {
  // Fetch list of images (could include pagination or filters)
  getImages: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data; // Expecting an array of image info
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  },

  // Fetch metadata for a specific image by ID or name
  getImageMetadata: async (imageName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${imageName}/metadata`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metadata for ${imageName}:`, error);
      throw error;
    }
  },

  // Get thumbnail URL for an image
  getThumbnailUrl: (imageName) => {
    return `http://localhost:3000/thumbnail/${imageName}`;
  },

  // Get full image URL
  getImageUrl: (imageName) => {
    return `http://localhost:3000/images/${imageName}`;
  },

  // Upload image (if upload feature implemented)
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default imageService;


import React, { useEffect, useState } from 'react';
import imageService from '../services/imageService';

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    imageService.getImages()
      .then(setImages)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="gallery">
      {images.map(img => (
        <img
          key={img.name}
          src={imageService.getThumbnailUrl(img.name)}
          alt={img.name}
          onClick={() => window.open(imageService.getImageUrl(img.name), '_blank')}
        />
      ))}
    </div>
  );
}

export default Gallery;
        
