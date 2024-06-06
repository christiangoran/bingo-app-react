import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";

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

const shuffledPhrases = randomSort([...phrases]);

const bingoLanes = [
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 12, 18, 23],
  [4, 9, 14, 19, 24],
  [5, 10, 15, 20, 25],
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
  [1, 7, 13, 19, 25],
  [5, 9, 13, 17, 21],
];

function App() {
  const initialClickedTiles = Array(25).fill(false);
  initialClickedTiles[12] = true;
  const [clickedTiles, setClickedTiles] = useState(initialClickedTiles);

  // Handles the click event on the tiles
  const handleClickedTile = (index) => {
    if (index === 12) return;
    setClickedTiles((prevClickedTiles) => {
      const newClickedTiles = [...prevClickedTiles];
      newClickedTiles[index] = !newClickedTiles[index];
      console.log(newClickedTiles);
      return newClickedTiles;
    });
  };

  // Checks if the user has a bingo
  const checkBingo = () => {
    bingoLanes.forEach((lane) => {
      const bingo = lane.every((tile) => clickedTiles[tile - 1]);
      if (bingo) {
        alert("Bingo, you win!");
        setClickedTiles(initialClickedTiles);
      }
    });
  };

  useEffect(
    (newClickedTiles) => {
      checkBingo(newClickedTiles);
    },
    [clickedTiles]
  );

  return (
    <div className="flex p-16 bg-indigo-950 justify-center rounded-xl">
      <div className="grid grid-cols-5 gap-x-2 gap-y-2 max-w-screen-md bg-red-900">
        {/* Mapping through the shuffled array of phrases */}

        {shuffledPhrases.map((phrase, index) => {
          const centerTile =
            index === 12 ? "Conference Bingo, may the best one win!" : phrase;
          const centerColor =
            index === 12
              ? "bg-lime-400 rounded-full"
              : "bg-yellow-300 rounded-md";
          const clickedColor = clickedTiles[index == 12 ? centerColor : index]
            ? "bg-blue-300 line-through text-gray-500"
            : centerColor;

          return (
            <div
              key={index}
              className={`flex items-center justify-center ${centerColor} ${clickedColor} p-4 w-36 h-36 hover:bg-red-300 transition-colors duration-300 ease-in-out`}
              onClick={() => {
                handleClickedTile(index);
              }}
            >
              <p className="text-center">{centerTile}</p>
            </div>
          );
        })}

        {/* --------------End of the mapping function---------------- */}
      </div>
    </div>
  );
}

export default App;
