import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

const VideoPlayer = ({ src, onLoaded, onError }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsLoading(true);
    setError(null);

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (onLoaded) onLoaded();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        setIsLoading(false);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - Unable to load stream');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - Unable to play stream');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error - Unable to play stream');
              hls.destroy();
              break;
          }
          if (onError) onError(data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (onLoaded) onLoaded();
      });
      video.addEventListener('error', () => {
        setIsLoading(false);
        setError('Error loading stream');
        if (onError) onError();
      });
    } else {
      setIsLoading(false);
      setError('HLS not supported in this browser');
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src, onLoaded, onError]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Unable to play video');
      });
    } else {
      video.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (video) {
      video.volume = e.target.value;
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-element"
          controls={false}
          playsInline
          muted={false}
        />
        
        {isLoading && (
          <div className="video-overlay loading">
            <div className="spinner"></div>
            <p>Loading stream...</p>
          </div>
        )}
        
        {error && (
          <div className="video-overlay error">
            <p>{error}</p>
          </div>
        )}
        
        {!src && (
          <div className="video-overlay placeholder">
            <p>No stream loaded</p>
            <p className="subtitle">Start a stream to begin</p>
          </div>
        )}
      </div>
      
      {src && !isLoading && !error && (
        <div className="video-controls">
          <button
            className={`control-btn play-pause ${isPlaying ? 'playing' : 'paused'}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.1"
              defaultValue="1"
              onChange={handleVolumeChange}
            />
          </div>
          
          <div className="stream-info">
            <span className="status-indicator active">
              ● Live
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;