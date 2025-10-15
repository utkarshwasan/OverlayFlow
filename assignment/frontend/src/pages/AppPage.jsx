import React from 'react';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import OverlayCanvas from '../components/OverlayCanvas';
import ControlsPanel from '../components/ControlsPanel';
import './AppPage.css';

const AppPage = () => {
  const { state, actions } = useApp();

  const handleOverlayClick = (index) => {
    // Optional: Add overlay interaction logic here
    console.log('Overlay clicked:', index);
  };

  if (!state.isStreamActive && !state.streamUrl) {
    return (
      <div className="app-page">
        <div className="no-stream-container">
          <div className="no-stream-content">
            <h2>No Active Stream</h2>
            <p>Please start a stream first to use the overlay features.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Go to Stream Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="container">
          <h1>Livestream Studio</h1>
          <div className="header-controls">
            <div className="stream-status">
              <span className={`status-indicator ${state.isStreamActive ? 'active' : 'inactive'}`}>
                ● {state.isStreamActive ? 'Live' : 'Offline'}
              </span>
            </div>
            {state.isStreamActive && (
              <button
                className="btn btn-danger btn-sm"
                onClick={actions.stopStream}
                disabled={state.loading}
              >
                {state.loading ? 'Stopping...' : 'Stop Stream'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="app-layout">
            <div className="video-section">
              <div className="video-wrapper">
                <VideoPlayer
                  src={state.streamUrl}
                  onLoaded={() => console.log('Stream loaded in app')}
                  onError={(error) => console.error('Stream error in app:', error)}
                />
                <OverlayCanvas
                  overlays={state.overlays}
                  onOverlayClick={handleOverlayClick}
                />
              </div>
            </div>

            <div className="controls-section">
              <ControlsPanel />
            </div>
          </div>

          {state.error && (
            <div className="error-banner">
              <p>{state.error}</p>
              <button
                className="btn btn-sm"
                onClick={actions.clearError}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Livestream App - Professional streaming with custom overlays</p>
        </div>
      </footer>
    </div>
  );
};

export default AppPage;