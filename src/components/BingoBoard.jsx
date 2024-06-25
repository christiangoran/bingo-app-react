import React, { useEffect, useRef } from "react";

const BingoBoard = ({
  shuffledPhrases,
  clickedTiles,
  handleClickedTile,
  onElementsCoordinates,
  identifier,
}) => {
  const tdRefs = useRef([]);

  useEffect(() => {
    const logCoordinates = () => {
      const coordinatesArray = tdRefs.current
        .map((td, index) => {
          if (td) {
            const tdElement = td.getBoundingClientRect();
            return {
              index,
              top: tdElement.top,
              right: tdElement.right,
              bottom: tdElement.bottom,
              left: tdElement.left,
            };
          }
          return null;
        })
        .filter(Boolean);
      onElementsCoordinates(identifier, coordinatesArray);
    };
    logCoordinates();
    window.addEventListener("resize", logCoordinates);
    return () => {
      window.removeEventListener("resize", logCoordinates);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
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
                const clickedColor = clickedTiles[index]
                  ? "line-through text-gray-500"
                  : centerColor;

                return (
                  <td
                    key={index}
                    ref={(tileElement) => (tdRefs.current[index] = tileElement)}
                    className={`border-x-2 border-orange-500 p-2 md:p-4 h-16 w-16 md:w-24 md:h-24 hover:bg-gray-100 transition-colors duration-300 ease-in-out cursor-pointer ${
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
  );
};

export default BingoBoard;
