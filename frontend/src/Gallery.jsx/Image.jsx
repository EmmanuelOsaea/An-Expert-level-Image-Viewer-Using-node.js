import React, { useState, useRef, useEffect } from 'react';

const Image = ({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  onErrorFallback,
  zoomEnabled = true,
  fullscreenEnabled = true,
  className = '',
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imgRef = useRef(null);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  // Handle image load error
  const handleError = () => {
    setIsError(true);
    if (onErrorFallback) onErrorFallback();
  };

  // Zoom handlers
  const zoomIn = () => {
    if (zoomEnabled) setZoomLevel((prev) => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    if (zoomEnabled) setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!fullscreenEnabled) return;
    if (!document.fullscreenElement) {
      imgRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation for zoom and fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div
      className={`image-viewer-container ${className}`}
      style={{ width, height, overflow: 'hidden', position: 'relative', ...style }}
      ref={imgRef}
      aria-label={alt}
      role="img"
      tabIndex={0}
    >
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt="placeholder"
          className="image-placeholder"
          style={{ filter: 'blur(10px)', width: '100%', height: '100%', objectFit: 'contain' }}
          aria-hidden="true"
        />
      )}
      {!isError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s ease',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: zoomEnabled ? 'zoom-in' : 'default',
          }}
          draggable={false}
        />
      ) : (
        <div className="image-error" role="alert" style={{ color: 'red', textAlign: 'center' }}>
          Failed to load image.
        </div>
      )}

      {/* Controls */}
      <div className="image-controls" style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: '10px' }}>
        {zoomEnabled && (
          <>
            <button aria-label="Zoom In" onClick={zoomIn} disabled={zoomLevel >= 5}>
              +
            </button>
            <button aria-label="Zoom Out" onClick={zoomOut} disabled={zoomLevel <= 1}>
              -
            </button>
          </>
        )}
        {fullscreenEnabled && (
          <button aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Image;
