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
  // Center tile is always clicked
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
        setClickedTiles([...initialClickedTiles]);
        setWinner(null);
      }, 3000); // Reset after 3 seconds
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

  // Check if a bingo has been achieved
  const checkBingo = (newClickedTiles) => {
    bingoLanes.forEach((lane) => {
      const bingo = lane.every((tile) => newClickedTiles[tile]);
      if (bingo) {
        socket.emit("bingo");
      }
    });
  };

  return (
    <div id="bingo-card" className="py-12 bg-white rounded-xl relative">
      {/* Content Wrapper */}
      <div className="w-100 flex justify-between">
        {/* Header and graphical details section */}
        <div className="flex flex-col">
          <div className="w-2/3 pl-12">
            <h1 className="text-7xl text-left">Bingo</h1>
            <p className="text-4xl text-left">a game for remote teams</p>
          </div>
        </div>
        {/* Bingo table and player list section */}
        <div className="flex flex-col justify-center pr-12">
          {/* Bingo Board wrapper */}
          <div className="w-100">
            <table className="border-collapse border-4 border-white">
              <tbody>
                {/* Each row of bingo tiles, 5 rows created */}
                {Array.from({ length: 5 }, (_, rowIndex) => (
                  <tr key={rowIndex} className="border-y-2 border-blue-500">
                    {/* Each column of bingo tiles, 5 columns created */}
                    {Array.from({ length: 5 }, (_, colIndex) => {
                      const index = rowIndex * 5 + colIndex;
                      {
                        /* Functionality to check for the center tile */
                      }
                      const tileContent =
                        index === 12
                          ? "Conference Bingo, may the best one win!"
                          : shuffledPhrases[index];
                      const centerColor =
                        index === 12
                          ? "rounded-full"
                          : "border-x-2 border-orange-500";
                      const clickedColor = clickedTiles[index]
                        ? "line-through text-gray-500"
                        : centerColor;

                      return (
                        // Each bingo tile
                        <td
                          key={index}
                          className={`border border-black p-4 w-24 h-24 hover:bg-gray-100 transition-colors duration-300 ease-in-out cursor-pointer ${
                            index === 12 ? centerColor : clickedColor
                          }`}
                          onClick={() => handleClickedTile(index)}
                        >
                          <p className="leading-3 text-center text-xs">
                            {tileContent}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* End Bingo Board wrapper */}
          {/* Player list */}
          <div className="mt-8">
            <h3 className="text-xl">Players:</h3>
            <ul className="flex flex-row p-4 justify-center">
              {Object.values(players).map((player) => (
                <li key={player.id} className="text-gray-400 px-2">
                  {player.name}: {player.score}
                </li>
              ))}
            </ul>
          </div>
          {/* End player list */}
        </div>
        {/* End Bingo table and player list section */}
      </div>
      {/* End Content Wrapper */}
      {/* Bingo win  message */}
      <div className="mt-8 absolute">
        {winner && <h2 className=" text-7xl">Bingo! {winner.name} wins!</h2>}
      </div>
      {/* End Bingo win message */}
    </div>
  );
}

export default App;
