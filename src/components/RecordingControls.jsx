const RecordingControls = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  disabled,
  recordingMode = 'chunked',
  onModeChange,
  dataChunkCount = 0,
  recordingDuration = 0
}) => {
  const handleModeChange = (mode) => {
    if (!isRecording && onModeChange) {
      onModeChange(mode);
    }
  };

  const handleStartClick = () => {
    if (onStartRecording) {
      onStartRecording(recordingMode);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="controls">
      {/* Recording Mode Selection */}
      <div className="recording-mode-selector">
        <h3 className="mode-title">Recording Mode</h3>
        <div className="mode-options">
          <button
            className={`mode-button ${recordingMode === 'chunked' ? 'active' : ''}`}
            onClick={() => handleModeChange('chunked')}
            disabled={isRecording}
          >
            <span className="mode-icon">📦</span>
            <div className="mode-info">
              <div className="mode-name">Chunked</div>
              <div className="mode-description">Auto-download every 1000 data points</div>
            </div>
          </button>
          
          <button
            className={`mode-button ${recordingMode === 'continuous' ? 'active' : ''}`}
            onClick={() => handleModeChange('continuous')}
            disabled={isRecording}
          >
            <span className="mode-icon">🔄</span>
            <div className="mode-info">
              <div className="mode-name">Continuous</div>
              <div className="mode-description">Download all data when stopped</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="recording-status">
          <div className="status-item">
            <span className="status-label">Duration:</span>
            <span className="status-value">{formatDuration(recordingDuration)}</span>
          </div>
          {recordingMode === 'chunked' && (
            <div className="status-item">
              <span className="status-label">Chunks Downloaded:</span>
              <span className="status-value">{dataChunkCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Recording Button */}
      <button
        onClick={isRecording ? onStopRecording : handleStartClick}
        disabled={disabled}
        className={`record-button ${isRecording ? 'stop' : 'start'}`}
      >
        {isRecording ? (
          <>
            <span className="button-icon">⏹️</span>
            Stop Recording
          </>
        ) : (
          <>
            <span className="button-icon">🔴</span>
            Start Recording ({recordingMode})
          </>
        )}
      </button>
      
      <div className="recording-info">
        <p>
          {isRecording 
            ? `Recording in ${recordingMode} mode - ${recordingMode === 'chunked' ? 'Files auto-download as chunks' : 'Click stop to download complete file'}`
            : `Click to begin data collection in ${recordingMode} mode`
          }
        </p>
      </div>
    </div>
  );
};

export default RecordingControls;
