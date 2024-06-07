import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./index.css";
import "./App.css";

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
  const initialClickedTiles = Array(25).fill(false);
  initialClickedTiles[12] = true;
  const [clickedTiles, setClickedTiles] = useState(initialClickedTiles);
  const [shuffledPhrases, setShuffledPhrases] = useState(
    generateShuffledPhrases()
  );
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);

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
        setShuffledPhrases(generateShuffledPhrases());
        setClickedTiles(initialClickedTiles);
        setWinner(null);
      }, 3000); // Reset after 3 seconds
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("tileClick");
      socket.off("bingo");
    };
  }, [initialClickedTiles]);

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
    bingoLanes.forEach((lane) => {
      const bingo = lane.every((tile) => newClickedTiles[tile]);
      if (bingo) {
        socket.emit("bingo");
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-16 bg-indigo-950 justify-center rounded-xl">
      <div className="grid grid-cols-5 gap-x-2 gap-y-2 max-w-screen-md bg-red-900">
        {shuffledPhrases.map((phrase, index) => {
          const centerTile =
            index === 12 ? "Conference Bingo, may the best one win!" : phrase;
          const centerColor =
            index === 12
              ? "bg-lime-400 rounded-full"
              : "bg-yellow-300 rounded-md";
          const clickedColor = clickedTiles[index]
            ? "bg-blue-300 line-through text-gray-500"
            : centerColor;

          return (
            <div
              key={index}
              className={`flex items-center justify-center ${
                index === 12 ? centerColor : clickedColor
              } p-4 w-36 h-36 hover:bg-red-300 transition-colors duration-300 ease-in-out`}
              onClick={() => handleClickedTile(index)}
            >
              <p className="text-center">{centerTile}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        {winner && (
          <h2 className="text-white text-2xl">Bingo! {winner.name} wins!</h2>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-white text-xl">Players:</h3>
        <ul>
          {Object.values(players).map((player) => (
            <li key={player.id} className="text-white">
              {player.name}: {player.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
