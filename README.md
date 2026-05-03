# Discord Bot

This is a Discord bot for TROLLZONE with registration, application/ticket, and trade systems.

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` file with your bot token: `TOKEN=your_token_here`
3. Run the bot: `npm start`

## Features

- `/hosgeldin` slash command: Shows welcome embed with select menu for registration options.
  - Selecting "Ekibe Başvur!" opens a modal for VTC info and creates a private ticket channel with approval button.
  - Other options lead to purpose selection and confirmation.
- `/ticaret` slash command: Opens a modal for trade details and creates a private trade channel.

## Usage

1. Use `/hosgeldin` for user registration.
2. For team applications, it creates tickets.
3. Use `/ticaret` to create trade channels.

## Features

- `/menu` slash command that shows a select menu with options.