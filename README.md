# Project Name: Taskforce Wallet

## Description

Taskforce Wallet is a web application that helps users manage transactions across different accounts and provides real-time information about budgets, accounts, and transactions. It offers APIs for creating, updating, deleting, and retrieving tasks, projects, budgets, and transactions. The server is built using Node.js and Express, and it connects to a MongoDB database for data storage. Additionally, it integrates WebSocket for real-time notifications and updates.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [WebSocket Integration](#websocket-integration)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the project, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/taskforce-wallet.git
    ```
    
2. Navigate to the project directory:

    ```sh
    cd taskforce-wallet
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

## Usage

To start the server, run the following command:

```sh
npm start
```

The server will start on the port specified in the configuration (default is 3000).

## Features

- **Task Management**: Create, update, delete, and retrieve tasks.
- **Schedule Report**: Create, update, delete, and retrieve Scheduling Report.
- **Budget Management**: Create, update, delete, and retrieve budgets.
- **Transaction Management**: Create, update, delete, and retrieve transactions.
- **Real-time Notifications**: WebSocket integration for real-time updates and notifications.
- **Input Validation**: Input validation using Joi.
- **Security**: Secure authentication and authorization across the platform.

## API Endpoints

### Auth
- `POST /auth` - Register a new user
- `POST /auth/login` - Login a user
- `POST /auth/logout` - Logout a user


### Budgets
- `GET /budgets` - Retrieve all budgets
- `POST /budgets` - Create a new budget
- `GET /budgets/:id` - Retrieve a budget by ID
- `PUT /budgets/:id` - Update a budget by ID
- `DELETE /budgets/:id` - Delete a budget by ID

### Accounts
- `GET /accounts` - Retrieve all accounts
- `POST /accounts` - Create a new account
- `GET /accounts/:accountId` - Retrieve an account by ID
- `PUT /accounts/:accountId` - Update an account by ID
- `DELETE /accounts/:accountId` - Delete an account by ID

### Transactions
- `GET /transactions` - Retrieve all transactions
- `POST /transactions` - Create a new transaction
- `GET /transactions/:transactionId` - Retrieve a transaction by ID
- `PUT /transactions/:transactionId` - Update a transaction by ID
- `DELETE /transactions/:transactionId` - Delete a transaction by ID

## Configuration

The server can be configured using environment variables. Create a `.env` file in the root directory and add the following variables:

```properties
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskforce
CLIENT_URL=http://localhost:3000
```

## WebSocket Integration

The server includes WebSocket integration for real-time notifications and updates. WebSocket connections can be accessed via the `/ws` route.

### WebSocket Events
- `accountBalanceUpdated`: Emitted when an account balance is updated.
- `budgetCreated`: Emitted when a new budget is created.
- `budgetUpdated`: Emitted when a budget is updated.
- `budgetDeleted`: Emitted when a budget is deleted.
- `budgetExceeded`: Emitted when a budget is exceeded.

### Example WebSocket Client

```javascript
const socket = io('http://localhost:3000');

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