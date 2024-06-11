# Bingo App

This is a Bingo game app designed for remote teams. The game allows players to join, click on tiles, and move circles around a bingo board. Players can win by completing bingo lanes, and the app announces the winner with an animation.

## Features

- **Responsive Design**: The app adjusts to different screen sizes, stacking content vertically on medium screens and below.
- **Movable Circles**: Circles that players can drag and position around the board.
- **Real-Time Updates**: Player actions are synced across all clients using Socket.io.
- **Winner Announcement**: A Lottie animation and message appear when a player wins.

## Components

- **App**: The main component that manages the game state and player interactions.
- **Header**: Displays the title and subtitle of the app.
- **BingoBoard**: The bingo board with clickable tiles.
- **PlayerList**: Shows the list of current players and their scores.
- **MovableCircles**: Renders and manages the draggable circles.
- **Winner**: Displays the winning animation and message.

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/bingo-app.git
cd bingo-app
```

2. Install dependencies:

```sh
npm install
```

3. Start the server:

```sh
node server.mjs
```

4. Start the client:

```sh
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Enter your name to start playing.
3. Click on the tiles to mark them.
4. Drag the circles around the board.
5. Complete a bingo lane to win the game.

## Technologies Used

- React
- Socket.io
- GSAP (GreenSock Animation Platform)
- Tailwind CSS
- Lottie

## License

Free to use in any form / Christian Göran
