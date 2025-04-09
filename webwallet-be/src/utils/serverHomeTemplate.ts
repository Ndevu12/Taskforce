import { getEnvVariable } from "../config/getVariable";

const CLIENT_URL = getEnvVariable("CLIENT_URL");
const logoPath = "/assets/money-taksy-logo.png";

export const ServerHomeTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Money Tasky API</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>

      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
      <div align="center" style="margin-bottom: 20px;">
        <img src="${logoPath}" alt="Money Tasky Logo" style="width: 100px; height: auto;" />

        <header style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Money Tasky API</h1>
          <p style="font-size: 1.2em;">Welcome to the Money Tasky API documentation.</p>
        </header>

        <p>This is the backend API for the Money Tasky application.</p>
        <h2>API Documentation</h2>
        <p>API documentation is available at <a href="/api-docs" target="_blank">API Documentation</a></p>
        <p>For more information, visit the <a href="${CLIENT_URL}" target="_blank">Money Tasky website</a></p>
        <footer style="margin-top: 20px; font-size: 0.9em; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Money Tasky. All rights reserved.</p>
          <p>Created with <i class="fas fa-heart" style="color: red;"></i> by Ndevu.</p>
        </footer>
      </div>
      </body>
      </html>
      `