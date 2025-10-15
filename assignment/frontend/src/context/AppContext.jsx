import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Initial state
const initialState = {
  overlays: [],
  streamUrl: null,
  savedOverlays: [],
  isStreamActive: false,
  loading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_OVERLAYS: 'SET_OVERLAYS',
  SET_STREAM_URL: 'SET_STREAM_URL',
  SET_SAVED_OVERLAYS: 'SET_SAVED_OVERLAYS',
  SET_STREAM_STATUS: 'SET_STREAM_STATUS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_OVERLAYS:
      return { ...state, overlays: action.payload };
    case ActionTypes.SET_STREAM_URL:
      return { ...state, streamUrl: action.payload };
    case ActionTypes.SET_SAVED_OVERLAYS:
      return { ...state, savedOverlays: action.payload };
    case ActionTypes.SET_STREAM_STATUS:
      return { ...state, isStreamActive: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setOverlays = (overlays) => {
    dispatch({ type: ActionTypes.SET_OVERLAYS, payload: overlays });
  };

  const setStreamUrl = (url) => {
    dispatch({ type: ActionTypes.SET_STREAM_URL, payload: url });
  };

  const setSavedOverlays = (overlays) => {
    dispatch({ type: ActionTypes.SET_SAVED_OVERLAYS, payload: overlays });
  };

  const setStreamStatus = (status) => {
    dispatch({ type: ActionTypes.SET_STREAM_STATUS, payload: status });
  };

  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // API actions
  const startStream = async (rtspUrl) => {
    setLoading(true);
    clearError();
    try {
      const response = await apiService.startStream(rtspUrl);
      setStreamUrl(response.hlsUrl);
      setStreamStatus(true);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to start stream');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stopStream = async () => {
    setLoading(true);
    clearError();
    try {
      await apiService.stopStream();
      setStreamUrl(null);
      setStreamStatus(false);
    } catch (error) {
      setError(error.message || 'Failed to stop stream');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOverlays = async () => {
    setLoading(true);
    clearError();
    try {
      const overlays = await apiService.getOverlays();
      setSavedOverlays(overlays);
      return overlays;
    } catch (error) {
      setError(error.message || 'Failed to fetch overlays');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveOverlay = async (overlay) => {
    setLoading(true);
    clearError();
    try {
      const savedOverlay = await apiService.saveOverlay(overlay);
      await fetchSavedOverlays();
      return savedOverlay;
    } catch (error) {
      setError(error.message || 'Failed to save overlay');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOverlay = async (id, overlay) => {
    setLoading(true);
    clearError();
    try {
      const updatedOverlay = await apiService.updateOverlay(id, overlay);
      await fetchSavedOverlays();
      return updatedOverlay;
    } catch (error) {
      setError(error.message || 'Failed to update overlay');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteOverlay = async (id) => {
    setLoading(true);
    clearError();
    try {
      await apiService.deleteOverlay(id);
      await fetchSavedOverlays();
    } catch (error) {
      setError(error.message || 'Failed to delete overlay');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadOverlay = (overlay) => {
    setOverlays([...state.overlays, overlay]);
  };

  const removeOverlay = (index) => {
    const newOverlays = state.overlays.filter((_, i) => i !== index);
    setOverlays(newOverlays);
  };

  const clearOverlays = () => {
    setOverlays([]);
  };

  // Check stream status on mount
  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        const status = await apiService.getStreamStatus();
        setStreamStatus(status.isActive);
        if (status.isActive && status.hlsUrl) {
          setStreamUrl(status.hlsUrl);
        }
      } catch (error) {
        console.error('Failed to check stream status:', error);
      }
    };

    checkStreamStatus();
    fetchSavedOverlays();
  }, []);

  const value = {
    state,
    actions: {
      setOverlays,
      setStreamUrl,
      setSavedOverlays,
      setStreamStatus,
      setLoading,
      setError,
      clearError,
      startStream,
      stopStream,
      fetchSavedOverlays,
      saveOverlay,
      updateOverlay,
      deleteOverlay,
      loadOverlay,
      removeOverlay,
      clearOverlays,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}