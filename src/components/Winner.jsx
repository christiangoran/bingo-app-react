import Lottie from "react-lottie";
import animationData from "../assets/animation.json";

const Winner = ({ winner }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 absolute inset-0 bg-white">
      {winner && (
        <>
          <Lottie options={defaultOptions} height={200} width={200} />
          <h2 className="text-4xl text-purple-500 md:text-7xl">
            Woho, {winner.name} has a bingo!
          </h2>
        </>
      )}
    </div>
  );
};

export default Winner;
