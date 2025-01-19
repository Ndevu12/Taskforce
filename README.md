# Project Name: Taskforce Wallet App

## Description

Taskforce Wallet is a web-based financial management platform designed to empower users to manage transactions, accounts, and budgets effectively. The application offers intuitive dashboards, advanced budget tracking, transaction management, and real-time updates via WebSocket. Users can generate reports, schedule periodic tasks, and maintain financial control seamlessly. The platform employs a modern tech stack for a robust, secure, and scalable system.

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

- **Client**: Located in the `UI/` folder.
- **Server**: Located in the `server/` folder.

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
    git clone https://github.com/Ndevu12/Taskforce.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Taskforce
    ```

3. Install dependencies for both client and server:

    - **Client**:
      ```bash
      cd UI
      yarn install
      ```

    - **Server**:
      ```bash
      cd server
      yarn install
      ```

4. Run the development servers:

    - **Client**:
      ```bash
      yarn dev
      ```

    - **Server**:
      ```bash
      yarn dev
      ```

## Usage

Run the application in development mode to explore its features. Access the client at the specified port (default: `3000`) and interact with the backend APIs.

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

Set up the server configuration using environment variables. Create a `.env` file in the `server/` folder with the following keys:

```properties
MONGO_URI=""
REDIS_URL=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""
CLIENT_URL=""
```

## WebSocket Integration

The server includes WebSocket integration for real-time notifications and updates.

### WebSocket Events
- `accountBalanceUpdated`: Emitted when an account balance is updated.
- `budgetCreated`: Emitted when a new budget is created.
- `budgetUpdated`: Emitted when a budget is updated.
- `budgetDeleted`: Emitted when a budget is deleted.
- `budgetExceeded`: Emitted when a budget is exceeded.

### Example WebSocket Client

```javascript
const socket = io(API_URL);

socket.on('accountBalanceUpdated', (data) => {
  console.log('Account balance updated:', data);
});

socket.on('budgetCreated', (data) => {
  console.log('New budget created:', data);
});

socket.on('budgetUpdated', (data) => {
  console.log('Budget updated:', data);
});

socket.on('budgetDeleted', (data) => {
  console.log('Budget deleted:', data);
});

socket.on('budgetExceeded', (data) => {
  console.log('Budget exceeded:', data);
});
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.