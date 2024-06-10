import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./index.css";
import "./App.css";
import MovableCircles from "./components/MovableCircles";
import BingoBoard from "./components/BingoBoard";
import PlayerList from "./components/PlayerList";
import Header from "./components/Header";

const socket = io("http://localhost:3001");

const phrases = [
  "Can you hear me?",
  "You're on mute.",
  "Sorry, I had connection issues.",
  "Can you see my screen?",
  "Let's wait a few more minutes for others to join.",
  "I think there's an echo.",
  "Can you repeat that?",
  "I'll follow up with an email.",
  "Who just joined?",
  "I have to jump on another call.",
  "Please mute if you're not speaking.",
  "Can everyone see this?",
  "Let's take this offline.",
  "Sorry, I was on mute.",
  "Is everyone here?",
  "Let's circle back to that.",
  "Can you send that to everyone?",
  "Let's schedule a follow-up meeting.",
  "I think we lost you for a moment.",
  "I have a hard stop at the top of the hour.",
  "Can you hear me now?",
  "I think there's a lag.",
  "Please mute yourself.",
  "I'll share my screen.",
  "Who is making that noise?",
];

function randomSort(arr) {
  return arr
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val);
}

const generateShuffledPhrases = () => randomSort([...phrases]);

const bingoLanes = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function App() {
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [completedLanes, setCompletedLanes] = useState([]);
  const [circlePositions, setCirclePositions] = useState(
    Array.from({ length: 25 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
    }))
  );
  const [shuffledPhrases, setShuffledPhrases] = useState(
    generateShuffledPhrases()
  );

  useEffect(() => {
    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("bingo", (data) => {
      setWinner(data.player);
      setTimeout(() => {
        setWinner(null);
      }, 3000); // Show the winner message for 3 seconds
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("bingo");
    };
  }, []);

  const handleCircleMove = (index, x, y) => {
    const newPositions = [...circlePositions];
    newPositions[index] = { x, y };
    setCirclePositions(newPositions);
    checkBingo(newPositions);
  };

  const checkBingo = (positions) => {
    const newCompletedLanes = [];

    bingoLanes.forEach((lane, laneIndex) => {
      const isBingo = lane.every((tileIndex) => {
        const circle = positions[tileIndex];
        const bingoTile = document.querySelector(`[data-index='${tileIndex}']`);
        const { left, top, right, bottom } = bingoTile.getBoundingClientRect();
        return (
          circle.x >= left &&
          circle.x <= right &&
          circle.y >= top &&
          circle.y <= bottom
        );
      });

      if (isBingo && !completedLanes.includes(laneIndex)) {
        newCompletedLanes.push(laneIndex);
        socket.emit("bingo");
      }
    });

    if (newCompletedLanes.length > 0) {
      setCompletedLanes((prevCompletedLanes) => [
        ...prevCompletedLanes,
        ...newCompletedLanes,
      ]);
    }
  };

  return (
    <div id="bingo-card" className="p-12 bg-white rounded-xl relative">
      <div className="w-full flex justify-between">
        <div className="flex flex-col">
          <Header />
          <MovableCircles
            onCircleMove={handleCircleMove}
            circlePositions={circlePositions}
          />
        </div>

        <div className="flex flex-col justify-center pr-12">
          <BingoBoard shuffledPhrases={shuffledPhrases} />

          <PlayerList players={players} />
        </div>
      </div>

      {/* Bingo win message */}
      <div className="mt-8 absolute">
        {winner && <h2 className=" text-7xl">{winner.name} got a bingo!</h2>}
      </div>
    </div>
  );
}

export default App;
