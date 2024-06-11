const PlayerList = ({ players }) => {
  return (
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
  );
};

export default PlayerList;
