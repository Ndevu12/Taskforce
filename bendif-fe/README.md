# Project Name: Bendif Wallet App

## Description

Bendif Wallet is a web-based financial management platform designed to empower users to manage transactions, accounts, and budgets effectively. The application offers intuitive dashboards, advanced budget tracking, transaction management, and real-time updates via WebSocket. Users can generate reports, schedule periodic tasks, and maintain financial control seamlessly. The platform employs a modern tech stack for a robust, secure, and scalable system.

## Table of Contents

- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [WebSocket Integration](#websocket-integration)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

This repository is a monorepo where both the client and server are defined together in different folders.

- **Frontend**: Located in the `bendif-fe/` folder.
- **Backend**: Located in the `bendif-be/` folder.

## Technology Stack

### Backend Technologies

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Joi** for input validation
- **TypeScript** for maintainable and scalable code

### Frontend Stack

- **ReactJS** with **Vite**
- **TypeScript** for strongly typed code
- **TailwindCSS** for styling
- **Axios** for API calls

### Advanced Features

- **Socket.IO** for real-time WebSocket communication
- **Redis** for caching

## Installation

To install the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/Ndevu12/Bendif.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Bendif
    ```

3. Install dependencies for both frontend and backend:

    - **Frontend**:
      ```bash
      cd bendif-fe
      yarn install
      ```

    - **Backend**:
      ```bash
      cd bendif-be
      yarn install
      ```

4. Run the development servers:

    - **Frontend**:
      ```bash
      yarn dev
      ```

    - **Backend**:
      ```bash
      yarn dev
      ```

## Usage

Run the application in development mode to explore its features. Access the frontend at http://localhost:7000 and interact with the backend APIs at http://localhost:3000.

## Features

- **Comprehensive Dashboard**:
  - Single-page layout with a sidebar and header for seamless navigation.
  - Real-time account, budget, and transaction summaries.
  - Integrated graphs for visualizing spending trends and budget progress.

- **User Authentication and Authorization**:
  - Login and registration with secure token-based authentication.
  - Role-based access control (e.g., Admin, User).

- **Account Management**:
  - Create, update, delete, and view accounts.
  - Support for multiple account types (e.g., Bank, Mobile Money, Cash).
  - Real-time account balance updates.

- **Transaction Management**:
  - Create, update, delete, and view transactions.
  - Search, filter, and paginate transaction history.
  - Clickable transactions for detailed modal view.

- **Budget Management**:
  - Create, update, delete, and view budgets.
  - Progress tracking with visual indicators for budget usage.
  - Alerts for exceeded budgets.

- **Reports**:
  - Generate auto-generated reports (e.g., transaction summaries, budget analysis).
  - Schedule periodic reports (Daily, Weekly, Monthly, etc.).
  - View scheduled reports and manage them directly in the dashboard.

- **Real-Time Notifications**:
  - Receive alerts for key events (e.g., budget exceeded, account updates).
  - View and manage notifications directly in the dashboard.
  - Mark notifications as read/unread and delete them.

- **Settings**:
  - Toggle between light and dark modes.
  - View and manage notification preferences.

- **Profile Management**:
  - Update user profile information, including name and password.
  - Upload and preview profile photos.

## API Endpoints

### Authentication
- `POST /auth` - Register a new user.
- `POST /auth/login` - Authenticate and login a user.
- `POST /auth/logout` - Logout the user.

### Accounts
- `GET /accounts` - Retrieve all accounts.
- `POST /accounts` - Create a new account.
- `GET /accounts/:accountId` - Retrieve an account by ID.
- `PUT /accounts/:accountId` - Update an account by ID.
- `DELETE /accounts/:accountId` - Delete an account by ID.

### Transactions
- `GET /transactions` - Retrieve all transactions.
- `POST /transactions` - Create a new transaction.
- `GET /transactions/:transactionId` - Retrieve a transaction by ID.
- `PUT /transactions/:transactionId` - Update a transaction by ID.
- `DELETE /transactions/:transactionId` - Delete a transaction by ID.

### Budgets
- `GET /budgets` - Retrieve all budgets.
- `POST /budgets` - Create a new budget.
- `GET /budgets/:id` - Retrieve a budget by ID.
- `PUT /budgets/:id` - Update a budget by ID.
- `DELETE /budgets/:id` - Delete a budget by ID.

## Configuration

Set up the frontend configuration using environment variables. Create a `.env` file in the `bendif-fe/` folder with the following keys:

```properties
VITE_BASE_URL=http://localhost:3000
VITE_APP_NAME=Bendif
```

bendif-fe/
├── public/                # Public assets
├── src/
│   ├── assets/            # Images and other static assets
│   ├── components/        # Reusable components
│   │   ├── Dashboard/     # Dashboard-specific components
│   │   ├── Notifications/ # Notification components
│   │   └── Profile/       # Profile-related components
│   ├── context/           # Contexts for global state management
│   ├── pages/             # Page-level components
│   │   ├── Auth/          # Login and Register pages
│   │   ├── Dashboard/     # Dashboard-related pages
│   │   └── Settings/      # Settings page
│   ├── services/          # API and helper functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point for the application
│   └── routes/            # Route definitions
└── vite.config.ts         # Vite configuration file

## Installation

To set up the frontend locally, follow these steps:

1. Navigate to the frontend directory:
    ```bash
    cd bendif-fe
    ```

2. Install the dependencies:
    ```bash
    yarn install
    ```

3. Start the development server:
    ```bash
    yarn dev
    ```

The application will run at `http://localhost:7000` (configured port for Vite).

## Usage

- Access the application by visiting the URL shown in the terminal.
- Use the dashboard to manage accounts, transactions, budgets, and reports.
- Notifications and real-time updates are integrated for an enhanced experience.

## Features

### **Dashboard**
- Displays a summary of accounts, budgets, and transactions.
- Real-time updates via WebSocket.

### **Accounts**
- Add, edit, delete, and view financial accounts.
- Multiple account types supported: Bank, Mobile Money, Cash.

### **Transactions**
- Create, edit, delete, and view transactions.
- Filter and search for transactions.
- Hoverable transactions with detailed modals.

### **Budgets**
- Set and track budgets with visual progress indicators.
- Alerts for exceeded budgets.

### **Reports**
- Generate and view financial reports.
- Scheduled reports for periodic summaries.

### **Notifications**
- View real-time alerts for financial activities.
- Mark notifications as read, unread, or delete them.

### **Settings**
- Toggle between light and dark modes.
- Manage notification preferences.

### **Authentication**
- Secure login and registration pages.
- Role-based access control.

## Development Guidelines

### **Styling**
- Use **TailwindCSS** for all styling.
- Maintain a consistent color scheme and typography.

### **State Management**
- Use React Context API for global states, such as authentication and theme.

### **Routing**
- Use `react-router-dom` for client-side routing.

### **Code Formatting**
- Use ESLint and Prettier for linting and formatting.
- Run the following to check for issues:
    ```bash
    yarn lint
    ```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
