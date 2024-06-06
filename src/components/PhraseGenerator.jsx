const PhraseGenerator = ({ phrase, centerTile, centerColor }) => {
  return (
    <div
      className={`flex items-center justify-center ${centerColor} p-4 w-36 h-36 hover:bg-red-300 transition-colors duration-300 ease-in-out`}
    >
      <p className="text-center">{centerTile}</p>
    </div>
  );
};

export default PhraseGenerator;
