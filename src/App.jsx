import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./index.css";
import "./App.css";
import MovableCircles from "./components/MovableCircles";
import Header from "./components/Header";
import BingoBoard from "./components/BingoBoard";
import PlayerList from "./components/PlayerList";
import Winner from "./components/Winner";

const socket = io("https://bingo-game-app-e5f95e82d4a4.herokuapp.com");

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
  const initialClickedTiles = Array(25).fill(false);
  initialClickedTiles[12] = true;
  const [clickedTiles, setClickedTiles] = useState(initialClickedTiles);
  const [shuffledPhrases, setShuffledPhrases] = useState(
    generateShuffledPhrases()
  );
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [name, setName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [completedBingoLanes, setCompletedBingoLanes] = useState([]);

  useEffect(() => {
    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("tileClick", (data) => {
      setClickedTiles((prevClickedTiles) => {
        const newClickedTiles = [...prevClickedTiles];
        newClickedTiles[data.index] = !newClickedTiles[data.index];
        return newClickedTiles;
      });
    });

    socket.on("bingo", (data) => {
      setWinner(data.player);
      setTimeout(() => {
        setWinner(null);
      }, 3000);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("tileClick");
      socket.off("bingo");
    };
  }, []);

  const handleClickedTile = (index) => {
    if (index === 12) return;
    setClickedTiles((prevClickedTiles) => {
      const newClickedTiles = [...prevClickedTiles];
      newClickedTiles[index] = !newClickedTiles[index];
      socket.emit("tileClick", { index });
      checkBingo(newClickedTiles);
      return newClickedTiles;
    });
  };

  const checkBingo = (newClickedTiles) => {
    bingoLanes.forEach((lane, laneIndex) => {
      if (completedBingoLanes.includes(laneIndex)) {
        return;
      }
      const bingo = lane.every((tile) => newClickedTiles[tile]);
      if (bingo) {
        setCompletedBingoLanes((prev) => [...prev, laneIndex]);
        socket.emit("bingo");
      }
    });
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setHasEnteredName(true);
      socket.emit("newPlayer", { name });
    }
  };

  if (!hasEnteredName) {
    return (
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleNameSubmit} className="text-center">
          <h1 className="text-2xl mb-4">Enter your name to start playing</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 p-2 mb-4 rounded-xl"
          />
          <br />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-xl"
          >
            Start Game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="bingo-card" className="py-12 bg-white rounded-xl relative">
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className="flex flex-col mb-8 md:mb-0">
          <Header />
          <MovableCircles className="hidden md:block" />
        </div>
        <div className="flex flex-col justify-center md:pr-12">
          <BingoBoard
            shuffledPhrases={shuffledPhrases}
            clickedTiles={clickedTiles}
            handleClickedTile={handleClickedTile}
            className="text-xs md:text-base"
          />
          <PlayerList players={players} />
        </div>
      </div>
      {winner && <Winner winner={winner} />}
    </div>
  );
}

export default App;
