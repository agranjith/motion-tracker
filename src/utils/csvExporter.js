import { saveAs } from 'file-saver';

/**
 * Converts motion sensor data to CSV format and triggers download
 * @param {Array} data - Array of sensor readings with timestamp, accelerometer, and gyroscope data
 * @param {string} filename - Name of the CSV file to download
 */
export const exportToCSV = (data, filename = 'sensor_data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'timestamp',
    'accel_x',
    'accel_y', 
    'accel_z',
    'gyro_alpha',
    'gyro_beta',
    'gyro_gamma'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => [
      new Date(row.timestamp).toISOString(),
      row.accelerometer?.x?.toFixed(6) || '0',
      row.accelerometer?.y?.toFixed(6) || '0',
      row.accelerometer?.z?.toFixed(6) || '0',
      row.gyroscope?.alpha?.toFixed(6) || '0',
      row.gyroscope?.beta?.toFixed(6) || '0',
      row.gyroscope?.gamma?.toFixed(6) || '0'
    ].join(','))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

/**
 * Alternative CSV export using native browser APIs (fallback)
 * @param {Array} data - Array of sensor readings
 * @param {string} filename - Name of the CSV file
 */
export const exportToCSVNative = (data, filename = 'sensor_data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = [
    'timestamp',
    'accel_x',
    'accel_y', 
    'accel_z',
    'gyro_alpha',
    'gyro_beta',
    'gyro_gamma'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      new Date(row.timestamp).toISOString(),
      row.accelerometer?.x?.toFixed(6) || '0',
      row.accelerometer?.y?.toFixed(6) || '0',
      row.accelerometer?.z?.toFixed(6) || '0',
      row.gyroscope?.alpha?.toFixed(6) || '0',
      row.gyroscope?.beta?.toFixed(6) || '0',
      row.gyroscope?.gamma?.toFixed(6) || '0'
    ].join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format sensor data for display
 * @param {Object} data - Raw sensor data
 * @returns {Object} Formatted data
 */
export const formatSensorData = (data) => {
  return {
    accelerometer: {
      x: data.accelerometer?.x?.toFixed(3) || '0.000',
      y: data.accelerometer?.y?.toFixed(3) || '0.000',
      z: data.accelerometer?.z?.toFixed(3) || '0.000'
    },
    gyroscope: {
      alpha: data.gyroscope?.alpha?.toFixed(3) || '0.000',
      beta: data.gyroscope?.beta?.toFixed(3) || '0.000',
      gamma: data.gyroscope?.gamma?.toFixed(3) || '0.000'
    }
  };
};
