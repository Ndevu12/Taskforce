import express, { Application } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import connectDB from "./mongooseConfig";
import router from "./routes";
import http from 'http';
import logger from './utils/logger';
import { ServerHomeTemplate } from "./utils/serverHomeTemplate";
import { initializeSocketServer, getIO } from './startUps/socketServer';
import { initializeSchedulerServer } from './startUps/schedulerServer';

dotenv.config();
const client_url = process.env.CLIENT_URL;
if (!client_url) {
    console.error('CLIENT_URL is not set in .env file');
    process.exit(1);
}

// Create Express app and HTTP server
const app: Application = express();
const server = http.createServer(app);

// Initialize socket.io server
const io = initializeSocketServer(server);

// Initialize scheduler server with 3-minute delay for initial report
initializeSchedulerServer();

const corsOptions = {
    origin: client_url,
    credentials: true,
};

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Morgan format for logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

app.get('/', (req, res) => {
    res.send(ServerHomeTemplate);
});

app.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

export { server, io };