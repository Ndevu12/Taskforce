import express, { Application } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import connectDB from "./mongooseConfig";
import router from "./routes";
import http from 'http';
import { Server } from 'socket.io';
import logger from './utils/logger';
import { swaggerDocs } from "./startups/swaggerSetup";

dotenv.config();
const client_url = process.env.CLIENT_URL;
if (!client_url) {
    console.error('CLIENT_URL is not set in .env file');
    process.exit(1);
}

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: client_url,
  },
});

const corsOptions = {
    origin: client_url,
    credentials: true,
};

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

// Morgan format for logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

// Setup Swagger
swaggerDocs(app);

app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

app.use(router);

// WebSocket connection
io.on('connection', (socket) => {
  logger.info('Client connected');
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { server, io };