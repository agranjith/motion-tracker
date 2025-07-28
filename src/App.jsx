import { useState } from 'react';
import { useMotionSensors } from './hooks/useMotionSensors';
import { exportToCSV } from './utils/csvExporter';
import SensorDashboard from './components/SensorDashboard';
import PermissionRequest from './components/PermissionRequest';
import RecordingControls from './components/RecordingControls';

function App() {
  const [notification, setNotification] = useState('');
  
  const {
    sensorData,
    isSupported,
    permissionState,
    isRecording,
    recordingDuration,
    dataChunkCount,
    recordingMode,
    requestPermission,
    startRecording,
    stopRecording,
    setRecordingMode,
    hasPermission,
    needsPermission,
    permissionDenied,
    sensorsAvailable
  } = useMotionSensors();

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      showNotification('✅ Permission granted! Sensors are now active.');
    } else {
      showNotification('❌ Permission denied. Please try again.');
    }
  };

  const handleStartRecording = (mode) => {
    const started = startRecording(mode);
    if (started) {
      showNotification(`🔴 Recording started in ${mode} mode`);
    } else {
      showNotification('❌ Could not start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await stopRecording();
      
      if (result.mode === 'chunked') {
        showNotification(`📁 ${result.message} - Total duration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`);
      } else if (result.data && result.data.length > 0) {
        await exportToCSV(result.data, result.filename);
        showNotification(`📁 Complete recording downloaded! Duration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`);
      } else {
        showNotification('⚠️ No data to export');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification('❌ Export failed');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  if (!isSupported || !sensorsAvailable) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Motion Tracker</h1>
          <p className="subtitle">Real-time device motion sensing & data export</p>
        </div>
        <PermissionRequest
          onRequestPermission={handleRequestPermission}
          permissionState={permissionState}
          sensorsAvailable={sensorsAvailable}
        />
      </div>
    );
  }

  if (needsPermission || permissionDenied) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Motion Tracker</h1>
          <p className="subtitle">Real-time device motion sensing & data export</p>
          <div className="github-link">
            <a 
              href="https://github.com/agranjith/motion-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-button"
            >
              <span className="github-icon">⭐</span>
              View on GitHub
            </a>
          </div>
        </div>
        <PermissionRequest
          onRequestPermission={handleRequestPermission}
          permissionState={permissionState}
          sensorsAvailable={sensorsAvailable}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Motion Tracker</h1>
        <p className="subtitle">Real-time device motion sensing & data export</p>
        <div className="github-link">
          <a 
            href="https://github.com/yourusername/motion-tracker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-button"
          >
            <span className="github-icon">⭐</span>
            View on GitHub
          </a>
        </div>
      </div>

      {hasPermission && (
        <SensorDashboard
          sensorData={sensorData}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          dataChunkCount={dataChunkCount}
          recordingMode={recordingMode}
        />
      )}

      <RecordingControls
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        disabled={!hasPermission}
        recordingMode={recordingMode}
        onModeChange={setRecordingMode}
        dataChunkCount={dataChunkCount}
        recordingDuration={recordingDuration}
      />

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <div className="footer">
        <p>Data is processed locally on your device • No data is sent to external servers</p>
      </div>
    </div>
  );
}

export default App;
