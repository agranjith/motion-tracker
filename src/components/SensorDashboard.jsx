import { formatSensorData } from '../utils/csvExporter';

const SensorDashboard = ({ 
  sensorData, 
  isRecording = false, 
  recordingDuration = 0, 
  dataChunkCount = 0, 
  recordingMode = 'chunked' 
}) => {
  const formattedData = formatSensorData(sensorData);

  const SensorCard = ({ title, data }) => (
    <div className="sensor-card">
      <h3 className="sensor-title">{title}</h3>
      {Object.entries(data).map(([axis, value]) => (
        <div key={axis} className="sensor-value">
          <span className="sensor-label">{axis}:</span>
          <span className="sensor-reading">{value}</span>
        </div>
      ))}
    </div>
  );

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sensor-section">
      <div className="status">
        <strong>Status: {isRecording ? `Recording (${recordingMode})` : 'Ready'}</strong>
        {isRecording && (
          <div className="status-details">
            <div>Duration: {formatDuration(recordingDuration)}</div>
            {recordingMode === 'chunked' && dataChunkCount > 0 && (
              <div>Chunks Downloaded: {dataChunkCount}</div>
            )}
          </div>
        )}
      </div>
      
      <SensorCard title="Accelerometer" data={formattedData.accelerometer} />
      <SensorCard title="Gyroscope" data={formattedData.gyroscope} />
    </div>
  );
};

export default SensorDashboard;
