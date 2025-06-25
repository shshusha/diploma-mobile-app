# 🚨 AlarmAppMobile - Emergency Alert System

A comprehensive React Native mobile application for emergency alert management and public safety monitoring. Built with modern TypeScript, tRPC, and TanStack Query for real-time emergency communications.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

AlarmAppMobile is a sophisticated emergency alert system designed for public safety organizations, emergency responders, and government agencies. The app provides real-time monitoring, alert management, and emergency communication capabilities with a focus on user experience and reliability.

### Key Capabilities

- **Real-time Emergency Alerts** - 18 different alert types with 6 severity levels
- **Multi-Account System** - Support for multiple user accounts and organizations
- **Location-Based Services** - GPS integration for location-specific alerts
- **Offline-First Design** - Works without internet connection with data sync
- **Type-Safe API** - Full TypeScript integration with tRPC for reliable data communication

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   tRPC Client   │    │   Alarm Server  │
│   (React Native)│◄──►│   (TypeScript)  │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AsyncStorage   │    │ TanStack Query  │    │   Database      │
│  (Local Cache)  │    │  (State Mgmt)   │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture

#### **Component Architecture**

```
App.tsx
├── TRPCProvider (API Context)
├── AppThemeProvider (Theme Context)
└── AppContainer (Navigation & State)
    ├── AccountSelectionScreen
    ├── DashboardScreen
    │   ├── StatusCard
    │   ├── QuickActionButton
    │   └── RecentAlertItem
    ├── AlertHistoryScreen
    ├── EmergencyContactsScreen
    └── EmergencyAlertScreen
```

#### **State Management Layers**

1. **Local Component State** - React hooks for UI state
2. **Global State** - Zustand for app-wide state
3. **Server State** - TanStack Query for API data
4. **Persistent State** - AsyncStorage for offline data

#### **Data Flow Architecture**

```
User Action → Component → Hook → State Manager → API Client → Server
     ↓
UI Update ← Component ← Hook ← State Manager ← Cache ← Response
```

### Backend Integration Architecture

#### **tRPC Integration**

- **Type-safe API calls** with automatic TypeScript inference
- **Real-time subscriptions** for live alert updates
- **Batch requests** for optimized network usage
- **Error handling** with retry logic and exponential backoff

#### **Query Management**

- **Intelligent caching** with TanStack Query
- **Background refetching** for data freshness
- **Optimistic updates** for better UX
- **Offline persistence** with AsyncStorage

### Security Architecture

#### **Data Protection**

- **Type validation** at runtime and compile time
- **Input sanitization** for all user inputs
- **Secure storage** for sensitive data
- **Network security** with HTTPS enforcement

#### **Authentication & Authorization**

- **Account-based access** control
- **Session management** with persistent login
- **Permission-based features** (future enhancement)

## ✨ Features

### 🚨 Emergency Alert System

#### **Alert Types (18 Categories)**

- **Weather Emergencies**: Tornado, Hurricane, Flood, Severe Weather
- **Natural Disasters**: Earthquake, Tsunami, Wildfire
- **Civil Emergencies**: Terrorism, Civil Unrest, Infrastructure Failure
- **Public Safety**: Amber Alert, Silver Alert, Hazmat Incident
- **Health Emergencies**: Public Health Emergency, Medical Alerts
- **Infrastructure**: Power Outage, Water Emergency, Road Closure
- **Evacuation**: Evacuation Order, Shelter in Place

#### **Severity Levels (6 Levels)**

1. **Info** - Informational, no immediate action
2. **Advisory** - Be aware of conditions
3. **Watch** - Prepare for possible emergency
4. **Warning** - Take immediate action
5. **Emergency** - Immediate action required
6. **Critical** - Life-threatening situation

### 📱 User Interface Features

#### **Dashboard Screen**

- **Real-time status monitoring** of system components
- **Active alerts display** with resolution capabilities
- **Quick action buttons** for emergency functions
- **System health indicators** with color-coded status
- **Pull-to-refresh** for manual data updates

#### **Alert Management**

- **Alert history** with filtering and search
- **Alert resolution** workflow
- **Custom alert creation** with location and description
- **Alert details** with full context information

#### **Emergency Contacts**

- **Contact management** (add, edit, delete)
- **Quick access** to emergency contacts
- **Contact categorization** and organization

### 🔧 Technical Features

#### **Offline Capabilities**

- **Data persistence** using AsyncStorage
- **Query caching** with intelligent invalidation
- **Offline-first design** with sync when online
- **Background sync** for critical data

#### **Location Services**

- **GPS integration** for location-based alerts
- **Permission handling** for location access
- **Location validation** and error handling
- **Geofencing** support (future enhancement)

#### **Performance Optimizations**

- **Lazy loading** of components and data
- **Image optimization** and caching
- **Memory management** with proper cleanup
- **Network optimization** with request batching

## 🛠️ Technology Stack

### **Core Framework**

- **React Native 0.80.0** - Cross-platform mobile development
- **TypeScript 5** - Type safety and developer experience
- **React 19.1.0** - Latest React features and hooks

### **State Management & Data**

- **Zustand 5.0.5** - Lightweight global state management
- **TanStack Query 5.81.0** - Server state management and caching
- **AsyncStorage 2.2.0** - Local data persistence
- **tRPC** - Type-safe API client with full TypeScript integration

### **UI & Styling**

- **React Native Paper 5.14.5** - Material Design components
- **React Native Vector Icons 10.2.0** - Comprehensive icon library
- **Custom theme system** - Dark/light mode with Material Design 3

### **Navigation & Layout**

- **React Native Screens 4.11.1** - Native screen transitions
- **React Native Safe Area Context 5.4.1** - Safe area handling
- **Custom navigation** - Screen state management

### **Location & Services**

- **React Native Community Geolocation 3.4.0** - GPS functionality
- **Permission handling** - Location and camera permissions

### **Development Tools**

- **Metro** - JavaScript bundler for React Native
- **ESLint & Prettier** - Code quality and formatting
- **Jest** - Testing framework
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **React Native CLI** or **Expo CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AlarmAppMobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)

   ```bash
   bundle install
   bundle exec pod install
   ```

4. **Configure tRPC Server**
   - Update `src/lib/config.ts` with your server URL
   - Ensure the alarm-app server is running on port 3000

### Running the App

#### **Start Metro Bundler**

```bash
npm start
# or
yarn start
```

#### **Run on Android**

```bash
npm run android
# or
yarn android
```

#### **Run on iOS**

```bash
npm run ios
# or
yarn ios
```

### Configuration

#### **Server Configuration**

Edit `src/lib/config.ts`:

```typescript
export const config = {
  trpc: {
    developmentUrl: 'http://YOUR_IP_ADDRESS:3000/api/trpc',
    productionUrl: 'https://your-production-domain.com/api/trpc',
  },
  app: {
    name: 'Safety Monitor',
    version: '1.0.0',
  },
};
```

#### **Find Your IP Address**

```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

## 📁 Project Structure

```
AlarmAppMobile/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Dashboard/        # Dashboard-specific components
│   │   ├── AppContainer.tsx  # Main app container
│   │   ├── LoadingScreen.tsx # Loading states
│   │   └── SystemStatusModal.tsx
│   ├── screens/              # Screen components
│   │   ├── AccountSelectionScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AlertHistoryScreen.tsx
│   │   ├── EmergencyContactsScreen.tsx
│   │   └── EmergencyAlertScreen.tsx
│   ├── lib/                  # Utilities and services
│   │   ├── trpc.ts           # tRPC client setup
│   │   ├── trpc-context.tsx  # tRPC provider
│   │   ├── config.ts         # App configuration
│   │   ├── constants.ts      # App constants
│   │   ├── alertUtils.ts     # Alert utilities
│   │   └── simulationService.ts
│   └── theme/                # Theme configuration
│       └── AppTheme.tsx
├── android/                  # Android-specific files
├── ios/                      # iOS-specific files
├── __tests__/                # Test files
├── App.tsx                   # Main app component
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔌 API Integration

### tRPC Endpoints

The app integrates with the alarm-app server using tRPC for type-safe API communication:

#### **Alerts**

- `alerts.getAll` - Get alerts with filtering
- `alerts.resolve` - Mark alert as resolved
- `alerts.create` - Create new alert

#### **Users**

- `users.getAll` - Get all users
- `users.getById` - Get user by ID
- `users.create` - Create new user

#### **Emergency Contacts**

- `emergencyContacts.*` - Manage emergency contacts

#### **Detection Rules**

- `detectionRules.*` - Manage detection rules

### Data Flow

1. **Query Execution**: TanStack Query manages API calls
2. **Caching**: Responses cached in memory and AsyncStorage
3. **Background Sync**: Automatic refetching for fresh data
4. **Error Handling**: Retry logic with exponential backoff
5. **Offline Support**: Cached data available offline

## 🛠️ Development

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Material Design** principles for UI

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Debugging

- **React Native Debugger** for debugging
- **Flipper** for network inspection
- **Chrome DevTools** for JavaScript debugging

### Common Issues

#### **tRPC Connection Issues**

1. Verify server is running on port 3000
2. Check IP address in `config.ts`
3. Ensure devices are on same network
4. Test connection in browser: `http://YOUR_IP:3000/trpc`

#### **iOS Build Issues**

```bash
cd ios
bundle exec pod install
cd ..
npx react-native run-ios
```

#### **Android Build Issues**

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## 🚀 Deployment

### Production Build

#### **Android**

```bash
cd android
./gradlew assembleRelease
```

#### **iOS**

1. Open `ios/AlarmAppMobile.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute via App Store Connect

### Environment Configuration

1. **Update production URL** in `src/lib/config.ts`
2. **Configure SSL certificates** for HTTPS
3. **Set up CI/CD** pipeline
4. **Configure app signing** for both platforms

### App Store Deployment

1. **Create app** in App Store Connect
2. **Upload build** via Xcode or CLI
3. **Configure metadata** and screenshots
4. **Submit for review**

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Code Standards

- Follow **TypeScript** best practices
- Use **Material Design** components
- Write **comprehensive tests**
- Update **documentation** for new features
- Follow **conventional commits** format

### Testing Checklist

- [ ] Unit tests for new components
- [ ] Integration tests for API calls
- [ ] UI tests for critical user flows
- [ ] Cross-platform testing (iOS/Android)
- [ ] Offline functionality testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the [TRPC_SETUP.md](TRPC_SETUP.md) file
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

### Planned Features

- **Push Notifications** for real-time alerts
- **Geofencing** for location-based alerts
- **Voice Commands** for hands-free operation
- **Multi-language Support** for international deployment
- **Advanced Analytics** and reporting
- **Integration APIs** for third-party systems

### Performance Improvements

- **Bundle size optimization**
- **Image lazy loading**
- **Advanced caching strategies**
- **Background processing**

---

**Built with ❤️ for public safety and emergency response**
