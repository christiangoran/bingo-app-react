import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

const MovableCircles = ({ onCircleMove, circlePositions }) => {
  const circleRefs = useRef([]);

  useEffect(() => {
    Draggable.create(circleRefs.current, {
      type: "x,y",
      bounds: "#bingo-card",
      onDragEnd: function () {
        const index = this.target.dataset.index;
        onCircleMove(index, this.x, this.y);
      },
    });

    // Set initial positions
    circleRefs.current.forEach((circle, index) => {
      if (circle) {
        gsap.set(circle, {
          x: circlePositions[index].x,
          y: circlePositions[index].y,
        });
      }
    });
  }, [onCircleMove, circlePositions]);

  return (
    <div id="circle-box" className="relative w-full h-full">
      {Array.from({ length: 25 }).map((_, index) => (
        <div
          key={index}
          data-index={index}
          ref={(element) => (circleRefs.current[index] = element)}
          className={`w-16 h-16 rounded-full bg-${
            ["red", "green", "blue", "yellow"][index % 4]
          }-500 absolute`}
        />
      ))}
    </div>
  );
};

export default MovableCircles;
