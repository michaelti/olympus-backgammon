# Olympus Backgammon – backend

Node.js backend for the work-in-progress Olympus Backgammon project. Connects to a separate [frontend](https://github.com/michaelti/olympus-backgammon-frontend) React interface.

![reviewdog](https://github.com/michaelti/olympus-backgammon-backend/workflows/reviewdog/badge.svg)

## Development

1. Install dependencies: `npm install`
2. Run the start script: `npm start`

Be sure to create a local `.env` file in the project root with the key `PORT` to set the Socket.IO listening port.

## Deployment

This project is hosted externally on a private server; these instructions are proprietary for the time being.

From the project directory:

1. Pull the latest changes: `git pull`
2. If there are updated dependencies, install them: `npm ci --production`
3. Restart the pm2 process: `pm2 restart index`
