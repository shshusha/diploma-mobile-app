# Safety Monitor - Emergency Alert System

A comprehensive real-time emergency monitoring and alert management system designed to enhance personal safety through intelligent detection, instant notifications, and emergency response coordination.

## 🚨 Overview

Safety Monitor is a modern web application that provides real-time monitoring and emergency alert management for individuals and organizations. The system combines location tracking, intelligent detection algorithms, and instant communication channels to ensure rapid response during emergencies.

## ✨ Key Features

### 🎯 Real-Time Monitoring

- **Location Tracking**: Continuous GPS monitoring with accuracy and speed data
- **Fall Detection**: AI-powered fall detection with configurable sensitivity
- **Immobility Detection**: Automatic alerts when users remain stationary for extended periods
- **Route Deviation**: Monitors for unexpected route changes or dangerous zone entries

### 🚨 Emergency Alert System

- **Multi-Channel Notifications**: Instant alerts via Telegram, with expandable notification channels
- **Severity Classification**: Six-level severity system (INFO, ADVISORY, WATCH, WARNING, EMERGENCY, CRITICAL)
- **Comprehensive Alert Types**: 20+ emergency categories including:
  - Natural disasters (weather, floods, earthquakes, tsunamis)
  - Civil emergencies (AMBER alerts, terrorism, infrastructure failures)
  - Health emergencies (public health, medical alerts)
  - Environmental hazards (wildfires, HAZMAT incidents)

### 👥 User Management

- **Multi-User Support**: Manage multiple users with individual profiles
- **Emergency Contacts**: Store and manage emergency contact information
- **Telegram Integration**: Direct messaging to users via Telegram bot
- **User Profiles**: Complete user profiles with contact information and preferences

### 🛡️ Safety Features

- **Detection Rules**: Customizable sensitivity settings for fall and immobility detection
- **Location History**: Track and analyze user movement patterns
- **Alert Resolution**: Mark alerts as resolved with timestamp tracking
- **Real-time Dashboard**: Live monitoring interface with automatic data refresh

### 📱 Modern Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Auto-refreshing dashboard with 30-second polling
- **Interactive Maps**: Visual location tracking and alert mapping
- **Dark/Light Theme**: User preference support with theme switching

## 🏗️ Technical Architecture

### Frontend

- **Next.js 15**: React-based full-stack framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, utility-first styling
- **Radix UI**: Accessible component library
- **tRPC**: End-to-end type-safe APIs

### Backend

- **PostgreSQL**: Robust relational database
- **Prisma ORM**: Type-safe database access
- **tRPC**: Type-safe API layer
- **Telegram Bot API**: Real-time messaging integration

### Key Technologies

- **React 19**: Latest React features and performance
- **TanStack Query**: Server state management
- **Zod**: Runtime type validation
- **Lucide React**: Beautiful icon library
- **Sonner**: Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Telegram Bot Token (for notifications)
- pnpm (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alarm-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file with:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/safety_monitor"
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   ```

4. **Database Setup**

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm reset-and-seed` - Reset and seed database
- `pnpm telegram` - Test Telegram bot connection

## 📊 Database Schema

### Core Entities

- **Users**: User profiles with contact information and Telegram integration
- **Alerts**: Emergency alerts with location, severity, and resolution tracking
- **Locations**: GPS tracking data with accuracy and movement metrics
- **Emergency Contacts**: Contact information for emergency situations
- **Detection Rules**: Configurable sensitivity settings for safety monitoring

### Alert Types

The system supports 20 different emergency categories including natural disasters, civil emergencies, health alerts, and infrastructure failures.

## 🔧 Configuration

### Detection Rules

- **Fall Sensitivity**: Adjustable from 0.1 to 1.0 (default: 0.8)
- **Immobility Timeout**: Configurable from 60 to 3600 seconds (default: 300)
- **Active Status**: Enable/disable detection rules per user

### Notification Settings

- **Telegram Integration**: Direct messaging to users
- **Severity Filtering**: Configure which alert levels trigger notifications
- **Location Data**: Include GPS coordinates in alerts

## 🛡️ Security Features

- **Type-safe APIs**: Full TypeScript coverage with tRPC
- **Input Validation**: Zod schema validation for all inputs
- **Database Security**: Prisma ORM with prepared statements
- **Environment Variables**: Secure configuration management

## 📈 Monitoring & Analytics

- **Real-time Dashboard**: Live monitoring of all users and alerts
- **Alert Statistics**: Track alert types, severity levels, and resolution times
- **User Activity**: Monitor user locations and movement patterns
- **System Health**: Automatic polling and data refresh

## 🔮 Future Enhancements

- **Mobile App**: Native iOS/Android applications
- **SMS Notifications**: Additional notification channels
- **AI Enhancement**: Machine learning for improved detection accuracy
- **Integration APIs**: Third-party emergency service integrations
- **Advanced Analytics**: Predictive analytics and trend analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Safety Monitor** - Keeping you safe, one alert at a time. 🛡️
