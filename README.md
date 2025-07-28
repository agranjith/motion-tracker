# 📱 Motion Tracker

A modern React application for real-time device motion sensor tracking with beautiful glassmorphism UI and CSV data export capabilities.

![Motion Tracker Preview](https://img.shields.io/badge/React-18%2B-blue) ![Vite](https://img.shields.io/badge/Vite-5%2B-646CFF) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Real-time Motion Tracking**: Monitor accelerometer and gyroscope data in real-time
- **iOS Safari Support**: Proper permission handling for iOS motion sensors
- **Unlimited Recording**: Two recording modes - chunked downloads or continuous recording
- **Smart CSV Export**: Automatic filename generation with timestamps and chunk numbers
- **Modern UI**: Beautiful glassmorphism design with smooth animations
- **Mobile Optimized**: Responsive design with mobile-first approach
- **Performance Optimized**: Animation frame loops and efficient data handling

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern browser with DeviceMotionEvent support
- HTTPS connection for mobile sensor access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/motion-tracker.git
   cd motion-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the app**
   - Local: `https://localhost:5173`
   - Network: `https://your-local-ip:5173`

## 📋 Usage

### Getting Started

1. **Grant Permissions**: On iOS devices, tap "Enable Motion Sensors" to grant permission
2. **Select Recording Mode**:
   - **Chunked**: Downloads data in 10-second chunks automatically
   - **Continuous**: Records until manually stopped, then downloads all data
3. **Start Recording**: Tap the green "Start Recording" button
4. **Monitor Data**: View real-time sensor readings on the dashboard
5. **Stop & Export**: Stop recording to download CSV data

### Recording Modes

#### 🔄 Chunked Recording
- Automatically downloads CSV files every 10 seconds
- Ideal for long-term monitoring
- Prevents memory issues with large datasets
- Filename format: `motion-data-chunk-1-YYYYMMDD-HHMMSS.csv`

#### � Continuous Recording
- Records all data in memory until stopped
- Single CSV download when recording ends
- Best for shorter recording sessions
- Filename format: `motion-data-YYYYMMDD-HHMMSS.csv`

### CSV Data Format

The exported CSV files contain the following columns:

| Column | Description | Unit |
|--------|-------------|------|
| `timestamp` | Unix timestamp in milliseconds | ms |
| `acceleration_x` | Linear acceleration X-axis | m/s² |
| `acceleration_y` | Linear acceleration Y-axis | m/s² |
| `acceleration_z` | Linear acceleration Z-axis | m/s² |
| `rotation_alpha` | Device orientation Z-axis | degrees |
| `rotation_beta` | Device orientation X-axis | degrees |
| `rotation_gamma` | Device orientation Y-axis | degrees |

## 🏗️ Project Structure

```
motion-tracker/
├── src/
│   ├── components/
│   │   ├── SensorDashboard.jsx      # Real-time sensor display
│   │   ├── RecordingControls.jsx    # Recording interface
│   │   └── PermissionRequest.jsx    # Permission handling
│   ├── hooks/
│   │   └── useMotionSensors.js      # Core sensor logic
│   ├── utils/
│   │   └── csvExporter.js           # CSV generation utilities
│   ├── App.jsx                      # Main application
│   ├── index.css                    # Glassmorphism styles
│   └── main.jsx                     # App entry point
├── public/
├── package.json
└── README.md
```

## 🎨 Design System

### Glassmorphism UI
- Backdrop blur effects with `backdrop-filter: blur()`
- Semi-transparent backgrounds with `rgba()` colors
- Layered shadows and borders for depth
- Smooth transitions and hover effects

### Color Palette
- **Primary Gradient**: Purple to blue animated gradient
- **Glass Elements**: White with varying opacity (10-25%)
- **Accents**: Green for start, red for stop actions
- **Text**: White with shadow for contrast

### Animations
- Powered by CSS transitions and keyframes
- Smooth glassmorphism hover effects
- Gradient background animation
- Button press feedback

## 🔧 Technical Details

### Core Technologies
- **React 18+**: Hooks, functional components, context
- **Vite**: Fast build tool with HTTPS support
- **FileSaver.js**: Client-side file downloads
- **Custom Hooks**: Sensor management and data processing

### Performance Features
- **Animation Frame Loop**: Smooth 60fps sensor updates
- **useRef Data Collection**: Avoids re-renders during recording
- **Chunked Processing**: Prevents memory overflow
- **Passive Event Listeners**: Optimized touch/scroll performance

### Browser APIs
- **DeviceMotionEvent**: Accelerometer and gyroscope data
- **DeviceOrientationEvent**: Device rotation angles
- **Permissions API**: iOS motion sensor permissions
- **File API**: CSV generation and download

## 📱 Mobile Support

### iOS Safari
- Requires HTTPS connection
- Permission request mandatory (iOS 13+)
- Full sensor access after permission granted

### Android Chrome/Firefox
- Works over HTTP and HTTPS
- No permission required
- Immediate sensor access

### Desktop Browsers
- Limited sensor support
- Mainly for development and testing

## 🚀 Deployment

### Local Network (Recommended)
```bash
npm run dev -- --host
```
Access via `https://your-local-ip:5173`

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Platforms
- **Vercel**: Zero-config deployment with HTTPS
- **Netlify**: Automatic HTTPS and form handling
- **GitHub Pages**: Free hosting with custom domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Device Motion API**: Web standards for sensor access
- **Glassmorphism**: Modern UI design trend
- **React Community**: Inspiration and best practices
- **Vite Team**: Amazing build tool and development experience

## � Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/motion-tracker/issues) page
2. Create a new issue with detailed information
3. Include browser type, device model, and error messages

---

**Made with ❤️ for motion tracking enthusiasts**

> 🔗 **Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)

- ✅ iOS Safari 13+ (requires permission)
- ✅ Android Chrome 50+
- ✅ Android Firefox 55+
- ⚠️ Desktop browsers (limited sensor support)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd motion-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📋 Usage

1. **Grant Permission**: On iOS Safari, tap "Allow Motion Access" to enable sensors
2. **View Live Data**: See real-time accelerometer and gyroscope values
3. **Record Data**: Tap the start button to begin recording sensor data
4. **Export Data**: Tap stop to automatically download a CSV file with all recorded data

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SensorDashboard.jsx    # Real-time sensor display
│   ├── PermissionRequest.jsx  # Permission request UI
│   └── RecordingControls.jsx  # Start/stop recording controls
├── hooks/
│   └── useMotionSensors.js    # Motion sensor management hook
├── utils/
│   └── csvExporter.js         # CSV generation and download
├── App.jsx                    # Main application component
└── index.css                  # Global styles with Tailwind
```

## 🎨 Design Features

- **Custom Glassmorphism**: Beautiful translucent cards with backdrop blur effects
- **CSS Variables**: Modern CSS custom properties for consistent theming
- **Gradient Backgrounds**: Beautiful animated gradients with floating elements
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Live Indicators**: Visual feedback for recording status and live data
- **Responsive Layout**: Mobile-first design optimized for all screen sizes
- **Modern Typography**: Poppins font family for excellent readability
- **Performance Optimized**: Efficient CSS animations and hover effects

## 📊 Data Export Format

The CSV export includes:
- `timestamp` - ISO timestamp of each reading
- `accel_x`, `accel_y`, `accel_z` - Accelerometer data (m/s²)
- `gyro_alpha`, `gyro_beta`, `gyro_gamma` - Gyroscope data (degrees/second)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Performance Optimizations

- Uses `useRef` for data collection to prevent unnecessary re-renders
- Passive event listeners for better scroll performance
- Efficient state management with custom hooks
- Optimized animations with Framer Motion

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations

---

**Note**: This app requires a device with motion sensors and HTTPS connection for sensor access. Best experienced on mobile devices.
