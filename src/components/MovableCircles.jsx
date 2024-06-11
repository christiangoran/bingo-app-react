import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

// Generate 25 circle positions
const generateCirclePositions = () => {
  const positions = [];
  const xRange = [20, 250];
  const yRange = [110, 300];
  const radius = 16; // Half the width/height of a circle

  for (let i = 0; i < 25; i++) {
    let newPos;
    let overlap;

    do {
      overlap = false;
      newPos = {
        x: Math.random() * (xRange[1] - xRange[0]) + xRange[0],
        y: Math.random() * (yRange[1] - yRange[0]) + yRange[0],
      };

      for (const pos of positions) {
        const distance = Math.sqrt(
          (pos.x - newPos.x) ** 2 + (pos.y - newPos.y) ** 2
        );
        if (distance < radius * 2) {
          overlap = true;
          break;
        }
      }
    } while (overlap);

    positions.push(newPos);
  }

  return positions;
};

const circlePositions = generateCirclePositions();

const MovableCircles = () => {
  const circleRefs = useRef([]);
  const colors = [
    "#ef4444", // red-500
    "#10b981", // green-500
    "#3b82f6", // blue-500
    "#f59e0b", // yellow-500
    "#8b5cf6", // purple-500
    "#ec4899", // pink-500
    "#6b7280", // gray-500
  ];

  useEffect(() => {
    Draggable.create(circleRefs.current, {
      type: "x,y",
      bounds: window,
    });

    circleRefs.current.forEach((circle, index) => {
      gsap.set(circle, {
        x: circlePositions[index].x,
        y: circlePositions[index].y,
      });
    });
  }, []);

  return (
    <div className="hidden md:block">
      {circlePositions.map((pos, index) => (
        <div
          key={index}
          ref={(el) => (circleRefs.current[index] = el)}
          className="w-16 h-16 rounded-full absolute"
          style={{
            left: pos.x,
            top: pos.y,
            backgroundColor: colors[index % colors.length],
          }}
        ></div>
      ))}
    </div>
  );
};

export default MovableCircles;
