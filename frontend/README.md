# Olympus Backgammon - frontend

React frontend for the work-in-progress Olympus Backgammon project. Connects to a separate [backend](https://github.com/michaelti/olympus-backgammon/tree/main/backend) Node.js server and the [olympus-bg](https://github.com/michaelti/olympus-backgammon/tree/main/olympus-bg) node module for gameplay logic.

### Development

1. Install dependencies: `npm install`
2. Run the start script: `npm run dev`

Be sure to create a local `.env` file in the project root with the key `VITE_BACKEND_URL` pointing to the backend server.

### Deployment

This project is hosted externally on a private server; these instructions are proprietary for the time being.

From the project directory:

1. Pull the latest changes: `git pull`
2. If there are updated dependencies, install them: `npm ci --production`
3. Build for production: `npm run build`
