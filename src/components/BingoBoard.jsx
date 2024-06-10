const BingoBoard = ({ shuffledPhrases }) => {
  return (
    <div className="w-full">
      <table className="border-collapse border-4 border-white">
        <tbody>
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <tr key={rowIndex} className="border-y-2 border-blue-500">
              {Array.from({ length: 5 }, (_, colIndex) => {
                const index = rowIndex * 5 + colIndex;
                const tileContent =
                  index === 12
                    ? "Conference Bingo, may the best one win!"
                    : shuffledPhrases[index];
                const centerColor =
                  index === 12
                    ? "rounded-full"
                    : "border-x-2 border-orange-500";

                return (
                  <td
                    key={index}
                    data-index={index}
                    className={`border-x-2 border-orange-500 p-4 w-24 h-24 hover:bg-gray-100 transition-colors duration-300 ease-in-out cursor-pointer ${centerColor}`}
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
  );
};

export default BingoBoard;
