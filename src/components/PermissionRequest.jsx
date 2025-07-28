const PermissionRequest = ({ onRequestPermission, permissionState, sensorsAvailable }) => {
  if (!sensorsAvailable) {
    return (
      <div className="permission-section">
        <h2>Device Sensors Not Available</h2>
        <p>Your device doesn't support motion sensors or you're using an unsupported browser.</p>
        <p>Try using a mobile device with Chrome, Safari, or Firefox.</p>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="permission-section">
        <h2>Permission Denied</h2>
        <p>Motion sensor access was denied. Please refresh the page and grant permission to use this app.</p>
        <button onClick={() => window.location.reload()} className="permission-button">
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="permission-section">
      <h2>Motion Tracker</h2>
      <p>This app needs access to your device's motion sensors to track accelerometer and gyroscope data.</p>
      {permissionState === 'unknown' && <p>Click the button below to grant permission.</p>}
      
      <button
        onClick={onRequestPermission}
        disabled={permissionState === 'requesting'}
        className="permission-button"
      >
        {permissionState === 'requesting' ? 'Requesting...' : 'Allow Motion Access'}
      </button>
      
      <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#666'}}>
        Your data stays on your device and is never sent to any server.
      </p>
    </div>
  );
};

export default PermissionRequest;
