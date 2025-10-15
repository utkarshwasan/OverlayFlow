import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { actions, state } = useApp();
  const [rtspUrl, setRtspUrl] = useState('');
  const [showStreamControls, setShowStreamControls] = useState(false);

  const handleStartStream = async () => {
    if (!rtspUrl.trim()) {
      alert('Please enter an RTSP URL');
      return;
    }

    try {
      await actions.startStream(rtspUrl);
      setShowStreamControls(true);
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Failed to start stream. Please check the RTSP URL and try again.');
    }
  };

  const handleStopStream = async () => {
    try {
      await actions.stopStream();
      setShowStreamControls(false);
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  const handleGoToApp = () => {
    navigate('/app');
  };

  const sampleUrls = [
    'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
    'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov',
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <h1>Livestream App</h1>
          <p>Professional livestreaming with custom overlays</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="stream-setup">
            <div className="setup-card">
              <h2>Start Your Stream</h2>
              <p className="subtitle">
                Enter your RTSP stream URL to begin livestreaming with custom overlays
              </p>

              <div className="stream-input-section">
                <div className="form-group">
                  <label className="label">RTSP Stream URL</label>
                  <input
                    type="url"
                    className="form-control stream-input"
                    placeholder="rtsp://example.com/stream"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                  />
                </div>

                <div className="sample-urls">
                  <p className="help-text">Try these sample URLs:</p>
                  {sampleUrls.map((url, index) => (
                    <button
                      key={index}
                      className="sample-url-btn"
                      onClick={() => setRtspUrl(url)}
                    >
                      Sample Stream {index + 1}
                    </button>
                  ))}
                </div>

                <div className="stream-actions">
                  {!showStreamControls ? (
                    <button
                      className="btn btn-primary btn-large"
                      onClick={handleStartStream}
                      disabled={!rtspUrl.trim() || state.loading}
                    >
                      {state.loading ? 'Starting...' : 'Start Stream'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger btn-large"
                      onClick={handleStopStream}
                      disabled={state.loading}
                    >
                      {state.loading ? 'Stopping...' : 'Stop Stream'}
                    </button>
                  )}
                </div>

                {state.error && (
                  <div className="error-message">
                    <p>{state.error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="video-preview">
              <h3>Stream Preview</h3>
              <div className="video-container">
                <VideoPlayer
                  src={state.streamUrl}
                  onLoaded={() => console.log('Stream loaded')}
                  onError={(error) => console.error('Stream error:', error)}
                />
              </div>
            </div>
          </div>

          {state.isStreamActive && (
            <div className="continue-section">
              <div className="continue-card">
                <h3>Ready to Add Overlays?</h3>
                <p>
                  Your stream is active! Continue to the main application to add 
                  custom text and image overlays to your livestream.
                </p>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleGoToApp}
                >
                  Continue to App
                </button>
              </div>
            </div>
          )}

          <div className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📹</div>
                <h3>Live Streaming</h3>
                <p>Stream RTSP feeds with real-time conversion to HLS for web playback</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Custom Overlays</h3>
                <p>Add text and image overlays with precise positioning and styling</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💾</div>
                <h3>Save & Load</h3>
                <p>Save overlay configurations and load them for future streams</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Real-time</h3>
                <p>See your overlays applied to the live stream in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 Livestream App. Built with React, Flask, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;