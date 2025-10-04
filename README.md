# Bendif

## Description

Bendif is a comprehensive financial management platform designed to empower users with intuitive control over their finances. The application provides a robust solution for tracking accounts, managing transactions, planning budgets, and generating insightful financial reports. With a modern user interface and secure architecture, this platform helps users achieve clarity and control in their financial journey.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Technical Features](#advanced-technical-features)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Experience
- **Intuitive Dashboard**: Quick overview of financial status with data visualizations
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dark & Light Modes**: Choose the viewing experience that suits your preference

### Core Functionality
- **Account Management**: Add, edit, and track multiple account types (bank, cash, savings, etc.)
- **Transaction Tracking**: Record and categorize income, expenses, and transfers
- **Budget Planning**: Set and monitor budget limits with visual progress indicators
- **Financial Reports**: Generate and view reports for better financial insights

### Security
- **Secure Authentication**: Protected user accounts with JWT-based authentication
- **Data Privacy**: End-to-end encryption ensures your financial data remains private
- **Role-Based Access**: Different permission levels based on user roles

### User Tools
- **Profile Management**: Update profile information and preferences
- **Notifications**: Receive alerts for important financial events
- **Financial Calendar**: View scheduled transactions and bill reminders

## Project Structure

The project is organized as a monorepo with frontend and backend in separate directories:

- **Frontend**: Located in the `webwallet-fe/` directory
- **Backend**: Located in the `webwallet-be/` directory

## Technology Stack

### Frontend Technologies
- **React.js** with **TypeScript** for a robust UI
- **Tailwind CSS** for responsive and customizable styling
- **Framer Motion** for smooth animations and transitions
- **Material UI** components for consistent UI elements
- **Chart.js** for data visualization
- **Axios** for API communication
- **Socket.IO Client** for real-time data updates

### Backend Technologies
- **Node.js** with **Express.js** framework
- **TypeScript** for type-safe development
- **MongoDB** for database management
- **Mongoose** ODM for data modeling
- **JWT** for authentication
- **Redis** for caching and session management
- **Socket.IO** for real-time bidirectional communication
- **Node-cron** for scheduling automated tasks

## Installation

Follow these steps to set up the project locally:

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Redis server (v6.0 or higher)

### Frontend Setup
```bash
# Navigate to frontend directory
cd webwallet-fe

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd webwallet-be

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with the following keys:
# MONGO_URI=your_mongodb_connection_string
# REDIS_URL=your_redis_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLIENT_URL=http://localhost:5173

# Start development server
npm run dev
```

## Usage

After installation, access the application through:
- Frontend: http://localhost:7000 (default Vite port)
- Backend API: http://localhost:3000 (default Express port)

### Getting Started
1. Register an account or login to your existing account
2. Set up your financial accounts (bank, cash, credit cards, etc.)
3. Start tracking your transactions and expenses
4. Create budgets to help manage your spending
5. Generate reports to gain insights into your finances

## Advanced Technical Features

### Redis Implementation
Bendif utilizes Redis for:
- **Authentication Caching**: Speeds up authorization checks and reduces database load
- **Session Management**: Maintains user sessions efficiently with fast read/write operations
- **Rate Limiting**: Protects API endpoints from abuse by implementing request rate limiting
- **Temporary Data Storage**: Stores short-lived data like verification codes and password reset tokens

### Real-time Updates with Socket.IO
The application leverages Socket.IO to provide real-time experiences:
- **Account Balance Updates**: See balance changes instantly without refreshing
- **Budget Alerts**: Receive immediate notifications when approaching budget limits
- **Transaction Confirmations**: Get instant confirmation when transactions are processed
- **Collaborative Features**: Supports multiple users viewing the same financial data simultaneously

### Automated Tasks with Cron Jobs
Node-cron powers scheduled tasks including:
- **Financial Report Generation**: Weekly and monthly reports automatically created and delivered via email
- **Budget Status Notifications**: Regular updates on budget statuses and financial goals
- **Account Syncing**: Scheduled synchronization of connected financial accounts
- **Data Maintenance**: Periodic cleanup and optimization of database records

### Setup Instructions for Advanced Features

#### Redis Configuration
```bash
# Install Redis
# For Ubuntu:
sudo apt-get install redis-server

# For macOS:
brew install redis

# Verify Redis is running
redis-cli ping
# Should return "PONG"
```

#### Socket.IO Integration
The Socket.IO server is automatically initialized when the backend starts. The frontend connects to it seamlessly for real-time updates. No additional configuration is typically required for development.

#### Cron Job Configuration
The application automatically initializes scheduled tasks when the server starts. You can modify the scheduling in the backend configuration files if needed.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2024 Bendif. All Rights Reserved.