/**
 * imageUtils.js
 * Utility functions for image processing and manipulation in the viewer application.
 */

/**
 * Load an image from a URL and return a Promise that resolves with the Image object.
 * @param {string} url - The URL of the image to load.
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS if needed for canvas operations
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image at ${url}`));
    img.src = url;
  });
}

/**
 * Resize an image to specified dimensions using a canvas.
 * Returns a data URL of the resized image.
 * @param {HTMLImageElement} image - The image element to resize.
 * @param {number} maxWidth - Maximum width of the resized image.
 * @param {number} maxHeight - Maximum height of the resized image.
 * @returns {string} - Data URL of the resized image.
 */
export function resizeImage(image, maxWidth, maxHeight) {
  const canvas = document.createElement('canvas');
  let { width, height } = image;

  // Calculate new dimensions while preserving aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    width = width * ratio;
    height = height * ratio;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}

/**
 * Convert a data URL to a Blob object.
 * Useful for uploading or further processing.
 * @param {string} dataURL - The data URL to convert.
 * @returns {Blob}
 */
export function dataURLToBlob(dataURL) {
  const [header, base64Data] = dataURL.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';

  const binary = atob(base64Data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

/**
 * Rotate an image by a given angle (degrees).
 * Returns a data URL of the rotated image.
 * @param {HTMLImageElement} image - The image element to rotate.
 * @param {number} degrees - Rotation angle in degrees (clockwise).
 * @returns {string} - Data URL of the rotated image.
 */
export function rotateImage(image, degrees) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const radians = (degrees * Math.PI) / 180;

  // Calculate new canvas size to fit rotated image
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const width = image.width;
  const height = image.height;
  const newWidth = width * cos + height * sin;
  const newHeight = width * sin + height * cos;

  canvas.width = newWidth;
  canvas.height = newHeight;

  // Translate and rotate context
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -width / 2, -height / 2);

  return canvas.toDataURL('image/png');
}

/**
 * Convert an image to grayscale.
 * Returns a data URL of the grayscale image.
 * @param {HTMLImageElement} image - The image element to convert.
 * @returns {string} - Data URL of the grayscale image.
 */
export function convertToGrayscale(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert each pixel to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
    // Alpha remains unchanged (data[i + 3])
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}
