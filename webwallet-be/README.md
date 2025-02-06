# Taskforce Wallet App - Backend

## Description

The backend of the **Taskforce Wallet App** is built using **Node.js** with **Express.js** and **TypeScript**, providing a robust and scalable API to manage financial operations such as accounts, transactions, budgets, and reports. It connects to a **MongoDB** database using **Mongoose** and integrates **Socket.IO** for real-time updates. This backend ensures secure user authentication and efficient data management.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [WebSocket Integration](#websocket-integration)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Technology Stack

The backend leverages the following technologies:

- **Node.js**: Server runtime for building scalable applications.
- **Express.js**: Lightweight and fast web framework.
- **MongoDB**: NoSQL database for efficient data storage and retrieval.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **TypeScript**: Adds static typing for maintainable and scalable code.
- **Joi**: Input validation for APIs.
- **Socket.IO**: Real-time event-based communication.
- **Redis**: Caching layer for performance optimization.

## Folder Structure

The backend application is located in the `server/` folder. Below is the folder structure:

server/ ├── src/ │ ├── config/ # Configuration files │ ├── controllers/ # API controllers │ ├── middlewares/ # Express middlewares │ ├── models/ # Mongoose models │ ├── routes/ # API routes │ ├── services/ # Business logic services │ ├── utils/ # Utility functions │ ├── app.ts # Express app initialization │ ├── server.ts # Entry point of the server └── package.json # Dependencies and scripts


## Installation

To set up the backend locally, follow these steps:

1. Navigate to the backend directory:
    ```bash
    cd server
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `server/` directory and add the following:
      ```properties
      MONGO_URI=""
      REDIS_URL=""
      JWT_SECRET=""
      JWT_REFRESH_SECRET=""
      CLIENT_URL=""
      ```

4. Start the development server:
    ```bash
    yarn dev
    ```

The backend will run at `http://localhost:5000` (default port).

## Usage

- Use the provided API endpoints to interact with the backend.
- WebSocket integration ensures real-time updates for connected clients.

## Features

- **Authentication and Authorization**:
  - Token-based authentication (JWT).
  - Role-based access control (Admin, User).

- **Account Management**:
  - Create, update, delete, and view financial accounts.
  - Real-time account balance updates.

- **Transaction Management**:
  - CRUD operations for transactions.
  - Supports filtering and pagination.

- **Budget Management**:
  - CRUD operations for budgets.
  - Real-time alerts for exceeded budgets.

- **Reports**:
  - Auto-generated and scheduled reports.
  - CRUD operations for scheduled reports.

- **WebSocket Integration**:
  - Real-time notifications for budget alerts, transaction updates, and account changes.

## API Endpoints

### Authentication
- `POST /auth` - Register a new user.
- `POST /auth/login` - Login a user.
- `POST /auth/logout` - Logout a user.

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

Set up the backend configuration using environment variables. Create a `.env` file in the `server/` folder with the following keys:

```properties
MONGO_URI=""
REDIS_URL=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""
CLIENT_URL=""
```

