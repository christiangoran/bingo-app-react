import { useState } from "react";
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

function App() {
  const [selectedTiles, setSelectedTiles] = useState([];)

  const handleClickedTile = (index) => {
    set
  };


  return (
    <div className="flex p-16 bg-indigo-950 justify-center rounded-xl">
      <div className="grid grid-cols-5 gap-x-2 gap-y-2 max-w-screen-md bg-red-900">
        {shuffledPhrases.map((phrase, index) => {
          const centerTile =
            index === 12 ? "Conference Bingo, may the best one win!" : phrase;
          const centerColor =
            index === 12
              ? "bg-lime-400 rounded-full"
              : "bg-yellow-300 rounded-md";

          return (
            <div
              key={index}
              className={`flex items-center justify-center ${centerColor} p-4 w-36 h-36 hover:bg-red-300 transition-colors duration-300 ease-in-out`}
              onClick={() => handleClickedTile(index)}
            >
              <p className="text-center">{centerTile}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
