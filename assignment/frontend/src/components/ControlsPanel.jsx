import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './ControlsPanel.css';

const ControlsPanel = () => {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    content: '',
    position: { x: 50, y: 50 },
    size: { width: 20, height: 10 },
    style: {
      color: '#ffffff',
      fontSize: '24px',
      zIndex: 1,
    },
  });

  useEffect(() => {
    actions.fetchSavedOverlays();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: name === 'position.x' || name === 'position.y' || 
                   name === 'size.width' || name === 'size.height'
            ? parseFloat(value) || 0
            : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'type' ? value : 
                (name === 'name' || name === 'content') ? value :
                prev[name]
      }));
    }
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [name]: name === 'zIndex' ? parseInt(value) || 1 : value
      }
    }));
  };

  const handleAddOverlay = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      actions.loadOverlay(formData);
      
      // Reset form
      setFormData({
        name: '',
        type: 'text',
        content: '',
        position: { x: 50, y: 50 },
        size: { width: 20, height: 10 },
        style: {
          color: '#ffffff',
          fontSize: '24px',
          zIndex: 1,
        },
      });
    } catch (error) {
      console.error('Error adding overlay:', error);
    }
  };

  const handleSaveOverlay = async () => {
    if (state.overlays.length === 0) {
      alert('No overlays to save');
      return;
    }

    const overlayToSave = state.overlays[state.overlays.length - 1];
    try {
      await actions.saveOverlay(overlayToSave);
      alert('Overlay saved successfully!');
    } catch (error) {
      console.error('Error saving overlay:', error);
      alert('Failed to save overlay');
    }
  };

  const handleLoadOverlay = (overlay) => {
    actions.loadOverlay(overlay);
  };

  const handleDeleteOverlay = async (id) => {
    if (confirm('Are you sure you want to delete this overlay?')) {
      try {
        await actions.deleteOverlay(id);
      } catch (error) {
        console.error('Error deleting overlay:', error);
      }
    }
  };

  const handleClearOverlays = () => {
    actions.clearOverlays();
  };

  return (
    <div className="controls-panel">
      <div className="panel-header">
        <h3>Overlay Controls</h3>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Overlay
        </button>
        <button
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Overlays
        </button>
        <button
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current ({state.overlays.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'add' && (
          <form onSubmit={handleAddOverlay} className="overlay-form">
            <div className="form-group">
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Type</label>
              <select
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">
                {formData.type === 'text' ? 'Text Content' : 'Image URL'}
              </label>
              <input
                type={formData.type === 'text' ? 'text' : 'url'}
                name="content"
                className="form-control"
                value={formData.content}
                onChange={handleInputChange}
                required
                placeholder={
                  formData.type === 'text' 
                    ? 'Enter text content' 
                    : 'https://example.com/image.png'
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Position X (%)</label>
                <input
                  type="number"
                  name="position.x"
                  className="form-control"
                  value={formData.position.x}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              <div className="form-group">
                <label className="label">Position Y (%)</label>
                <input
                  type="number"
                  name="position.y"
                  className="form-control"
                  value={formData.position.y}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Width (%)</label>
                <input
                  type="number"
                  name="size.width"
                  className="form-control"
                  value={formData.size.width}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  step="1"
                />
              </div>
              <div className="form-group">
                <label className="label">Height (%)</label>
                <input
                  type="number"
                  name="size.height"
                  className="form-control"
                  value={formData.size.height}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            {formData.type === 'text' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Text Color</label>
                    <input
                      type="color"
                      name="color"
                      className="form-control color-input"
                      value={formData.style.color}
                      onChange={handleStyleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Font Size</label>
                    <select
                      name="fontSize"
                      className="form-control"
                      value={formData.style.fontSize}
                      onChange={handleStyleChange}
                    >
                      <option value="16px">Small</option>
                      <option value="24px">Medium</option>
                      <option value="32px">Large</option>
                      <option value="48px">Extra Large</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="label">Layer Order (Z-Index)</label>
              <input
                type="number"
                name="zIndex"
                className="form-control"
                value={formData.style.zIndex}
                onChange={handleStyleChange}
                min="1"
                max="10"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Overlay
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSaveOverlay}
              >
                Save Current
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClearOverlays}
              >
                Clear All
              </button>
            </div>
          </form>
        )}

        {activeTab === 'saved' && (
          <div className="saved-overlays">
            {state.savedOverlays.length === 0 ? (
              <p className="no-overlays">No saved overlays found</p>
            ) : (
              state.savedOverlays.map(overlay => (
                <div key={overlay._id} className="overlay-item">
                  <div className="overlay-info">
                    <h4>{overlay.name}</h4>
                    <p className="overlay-type">{overlay.type}</p>
                    <p className="overlay-details">
                      Position: ({overlay.position.x}%, {overlay.position.y}%)<br />
                      Size: {overlay.size.width}% × {overlay.size.height}%
                    </p>
                  </div>
                  <div className="overlay-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleLoadOverlay(overlay)}
                    >
                      Load
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteOverlay(overlay._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'current' && (
          <div className="current-overlays">
            {state.overlays.length === 0 ? (
              <p className="no-overlays">No current overlays</p>
            ) : (
              state.overlays.map((overlay, index) => (
                <div key={index} className="overlay-item">
                  <div className="overlay-info">
                    <h4>{overlay.name}</h4>
                    <p className="overlay-type">{overlay.type}</p>
                    <p className="overlay-details">
                      Position: ({overlay.position.x}%, {overlay.position.y}%)
                    </p>
                  </div>
                  <div className="overlay-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => actions.removeOverlay(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsPanel;