import React from 'react';
import './OverlayCanvas.css';

const OverlayCanvas = ({ overlays, onOverlayClick }) => {
  const renderOverlay = (overlay, index) => {
    const { type, content, position, size, style } = overlay;
    
    const overlayStyle = {
      position: 'absolute',
      left: `${position.x}%`,
      top: `${position.y}%`,
      width: `${size.width}%`,
      height: `${size.height}%`,
      zIndex: style.zIndex || 1,
      cursor: onOverlayClick ? 'pointer' : 'default',
    };

    if (type === 'text') {
      return (
        <div
          key={index}
          className="overlay-text"
          style={{
            ...overlayStyle,
            color: style.color || '#ffffff',
            fontSize: style.fontSize || '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            wordWrap: 'break-word',
            overflow: 'hidden',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
          onClick={() => onOverlayClick && onOverlayClick(index)}
        >
          {content}
        </div>
      );
    }

    if (type === 'image') {
      return (
        <img
          key={index}
          src={content}
          alt={overlay.name || 'Overlay'}
          className="overlay-image"
          style={{
            ...overlayStyle,
            objectFit: 'contain',
          }}
          onClick={() => onOverlayClick && onOverlayClick(index)}
          onError={(e) => {
            console.error('Failed to load overlay image:', content);
            e.target.style.display = 'none';
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="overlay-canvas">
      {overlays.map(renderOverlay)}
    </div>
  );
};

export default OverlayCanvas;