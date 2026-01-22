function Gallery({ onImageClick }) {
  // ... your existing code ...

  return (
    <div className="gallery">
      {images.map(img => (
        <img
          key={img.name}
          src={imageService.getThumbnailUrl(img.name)}
          alt={img.name}
          onClick={() => onImageClick(img.name)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
}
