import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling device motion and orientation sensors
 * Manages permissions, data collection, and real-time updates
 */
export const useMotionSensors = () => {
  // State management
  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 }
  });
  
  const [permissionState, setPermissionState] = useState('unknown'); // 'unknown', 'granted', 'denied', 'requesting'
  const [isSupported, setIsSupported] = useState({
    motion: false,
    orientation: false
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [dataChunkCount, setDataChunkCount] = useState(0);
  const [recordingMode, setRecordingMode] = useState('chunked'); // 'chunked' or 'continuous'
  
  // Refs for performance optimization
  const sensorDataRef = useRef([]);
  const recordingStartTime = useRef(null);
  const recordingInterval = useRef(null);
  const motionListenerRef = useRef(null);
  const orientationListenerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunkSize = useRef(1000); // Number of data points per chunk
  const autoDownloadInterval = useRef(null);
  const latestSensorDataRef = useRef({
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 }
  });

  // Check sensor support on mount
  useEffect(() => {
    const checkSupport = () => {
      const motionSupport = 'DeviceMotionEvent' in window;
      const orientationSupport = 'DeviceOrientationEvent' in window;
      
      setIsSupported({
        motion: motionSupport,
        orientation: orientationSupport
      });
      
      // For iOS 13+, we need to check if permission is required
      if (motionSupport && typeof DeviceMotionEvent.requestPermission === 'function') {
        setPermissionState('unknown');
      } else if (motionSupport || orientationSupport) {
        setPermissionState('granted');
      } else {
        setPermissionState('denied');
      }
    };

    checkSupport();
  }, []);

  // Motion event handler
  const handleMotionEvent = useCallback((event) => {
    const newData = {
      accelerometer: {
        x: event.acceleration?.x || event.accelerationIncludingGravity?.x || 0,
        y: event.acceleration?.y || event.accelerationIncludingGravity?.y || 0,
        z: event.acceleration?.z || event.accelerationIncludingGravity?.z || 0
      },
      gyroscope: {
        alpha: event.rotationRate?.alpha || 0,
        beta: event.rotationRate?.beta || 0,
        gamma: event.rotationRate?.gamma || 0
      }
    };

    // Store latest data in ref
    latestSensorDataRef.current = newData;

    // Record data if recording is active
    if (isRecording) {
      sensorDataRef.current.push({
        timestamp: Date.now(),
        ...newData
      });

      // Auto-download chunks if in chunked mode (non-blocking)
      if (recordingMode === 'chunked' && sensorDataRef.current.length >= chunkSize.current) {
        // Use setTimeout to make this non-blocking
        setTimeout(() => {
          handleAutoChunkDownload().catch(error => {
            console.error('Auto chunk download error:', error);
          });
        }, 0);
      }
    }
  }, [isRecording, recordingMode]);

  // Orientation event handler (fallback for gyroscope data)
  const handleOrientationEvent = useCallback((event) => {
    latestSensorDataRef.current = {
      ...latestSensorDataRef.current,
      gyroscope: {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      }
    };
  }, []);

  // Animation frame loop for smooth updates
  const updateSensorDisplay = useCallback(() => {
    setSensorData({ ...latestSensorDataRef.current });
    animationFrameRef.current = requestAnimationFrame(updateSensorDisplay);
  }, []);

  // Generate filename with timestamp and chunk info
  const generateFilename = useCallback((chunkNumber = null, isComplete = false) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    
    if (chunkNumber !== null) {
      return `motion-data_${dateStr}_${timeStr}_chunk-${chunkNumber.toString().padStart(3, '0')}.csv`;
    } else if (isComplete) {
      return `motion-data_${dateStr}_${timeStr}_complete.csv`;
    } else {
      return `motion-data_${dateStr}_${timeStr}.csv`;
    }
  }, []);

  // Download chunk of data
  const downloadChunk = useCallback(async (data, chunkNumber) => {
    if (data.length === 0) return;
    
    try {
      const { exportToCSV } = await import('../utils/csvExporter');
      const filename = generateFilename(chunkNumber);
      await exportToCSV(data, filename);
      return true;
    } catch (error) {
      console.error('Chunk download failed:', error);
      return false;
    }
  }, [generateFilename]);

  // Auto-download chunks during recording
  const handleAutoChunkDownload = useCallback(async () => {
    if (recordingMode === 'chunked' && sensorDataRef.current.length >= chunkSize.current) {
      try {
        const chunkData = sensorDataRef.current.splice(0, chunkSize.current);
        const currentChunk = dataChunkCount + 1;
        
        const success = await downloadChunk(chunkData, currentChunk);
        if (success) {
          setDataChunkCount(currentChunk);
        }
      } catch (error) {
        console.error('Auto chunk download error:', error);
      }
    }
  }, [recordingMode, dataChunkCount, downloadChunk]);

  // Request permissions (iOS Safari)
  const requestPermission = async () => {
    setPermissionState('requesting');
    
    try {
      // Request motion permission for iOS
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const motionPermission = await DeviceMotionEvent.requestPermission();
        
        if (motionPermission === 'granted') {
          setPermissionState('granted');
          return true;
        } else {
          setPermissionState('denied');
          return false;
        }
      }
      
      // For other browsers, assume permission is granted if sensors are supported
      if (isSupported.motion || isSupported.orientation) {
        setPermissionState('granted');
        return true;
      }
      
      setPermissionState('denied');
      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      setPermissionState('denied');
      return false;
    }
  };

  // Start sensor monitoring
  const startSensorMonitoring = useCallback(() => {
    if (permissionState !== 'granted') return;

    // Add motion event listener
    if (isSupported.motion) {
      motionListenerRef.current = handleMotionEvent;
      window.addEventListener('devicemotion', motionListenerRef.current, { passive: true });
    }

    // Add orientation event listener (fallback)
    if (isSupported.orientation) {
      orientationListenerRef.current = handleOrientationEvent;
      window.addEventListener('deviceorientation', orientationListenerRef.current, { passive: true });
    }

    // Start animation frame loop for smooth updates
    animationFrameRef.current = requestAnimationFrame(updateSensorDisplay);
  }, [permissionState, isSupported, handleMotionEvent, handleOrientationEvent, updateSensorDisplay]);

  // Stop sensor monitoring
  const stopSensorMonitoring = useCallback(() => {
    if (motionListenerRef.current) {
      window.removeEventListener('devicemotion', motionListenerRef.current);
      motionListenerRef.current = null;
    }

    if (orientationListenerRef.current) {
      window.removeEventListener('deviceorientation', orientationListenerRef.current);
      orientationListenerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Start recording data
  const startRecording = useCallback((mode = 'chunked') => {
    if (permissionState !== 'granted') return false;

    sensorDataRef.current = [];
    recordingStartTime.current = Date.now();
    setIsRecording(true);
    setRecordingDuration(0);
    setDataChunkCount(0);
    setRecordingMode(mode);

    // Update recording duration every second
    recordingInterval.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    return true;
  }, [permissionState]);

  // Stop recording and return collected data
  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }

    if (autoDownloadInterval.current) {
      clearInterval(autoDownloadInterval.current);
      autoDownloadInterval.current = null;
    }

    const collectedData = [...sensorDataRef.current];
    const finalDuration = recordingDuration;
    const finalChunkCount = dataChunkCount;
    
    // Reset state
    setRecordingDuration(0);
    setDataChunkCount(0);
    sensorDataRef.current = [];
    
    // For chunked mode, download final chunk if any remaining data
    if (recordingMode === 'chunked' && collectedData.length > 0) {
      const finalChunk = finalChunkCount + 1;
      await downloadChunk(collectedData, finalChunk);
      return { 
        chunks: finalChunk, 
        duration: finalDuration,
        mode: 'chunked',
        message: `Downloaded ${finalChunk} chunks`
      };
    }
    
    // For continuous mode, return all data
    return { 
      data: collectedData, 
      duration: finalDuration,
      mode: 'continuous',
      filename: generateFilename(null, true)
    };
  }, [recordingDuration, dataChunkCount, recordingMode, downloadChunk, generateFilename]);

  // Start monitoring when permission is granted
  useEffect(() => {
    if (permissionState === 'granted') {
      startSensorMonitoring();
    }

    return () => {
      stopSensorMonitoring();
    };
  }, [permissionState, startSensorMonitoring, stopSensorMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSensorMonitoring();
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (autoDownloadInterval.current) {
        clearInterval(autoDownloadInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stopSensorMonitoring]);

  return {
    // Data
    sensorData,
    isSupported,
    permissionState,
    isRecording,
    recordingDuration,
    dataChunkCount,
    recordingMode,
    
    // Actions
    requestPermission,
    startRecording,
    stopRecording,
    setRecordingMode,
    
    // Computed values
    hasPermission: permissionState === 'granted',
    needsPermission: permissionState === 'unknown',
    permissionDenied: permissionState === 'denied',
    sensorsAvailable: isSupported.motion || isSupported.orientation
  };
};
