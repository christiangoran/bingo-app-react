# Bingo App

This is a Bingo game app designed for remote teams. The game allows players to join, click on tiles, and move circles around a bingo board. Players can win by completing bingo lanes, and the app announces the winner with an animation.

Note: To see the code for the current deployed version, please se click-row-branch branch instead of main.

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

## Future Update

I tried to implement draggable circles instead of clicking on each tile but failed miserably with getting the coordinates of tiles and circles to match. This also turned out to be a nightmare responsiveness wise, so this will have be a part of a future update. Right now the running version can be found in the click-row-branch instead of main branch.
For now, the circle elements can be dragged around, but do not serve any other purpose than looking real nice as decoration to my Googleish(?) kind of design :D

## License

Free to use in any form / Christian Göran
