import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

const MovableCircles = () => {
  const circleRefs = useRef([]);

  useEffect(() => {
    Draggable.create(circleRefs.current, {
      type: "x,y",
      bounds: window,
    });
  }, []);

  return (
    <div>
      <div
        id="circle-1"
        ref={(el) => (circleRefs.current[0] = el)}
        className="w-16 h-16 rounded-full bg-red-500 absolute"
      />
      <div
        id="circle-2"
        ref={(el) => (circleRefs.current[1] = el)}
        className="w-16 h-16 rounded-full bg-green-500 absolute"
      />
      <div
        id="circle-3"
        ref={(el) => (circleRefs.current[2] = el)}
        className="w-16 h-16 rounded-full bg-blue-500 absolute"
      />
      <div
        id="circle-4"
        ref={(el) => (circleRefs.current[3] = el)}
        className="w-16 h-16 rounded-full bg-yellow-500 absolute"
      />
    </div>
  );
};

export default MovableCircles;
