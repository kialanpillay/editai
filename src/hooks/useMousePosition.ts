import { RefObject, useEffect, useState } from "react";

interface IUseMousePosition {
  divRef: RefObject<HTMLDivElement>;
}

export const useMousePosition = ({ divRef }: IUseMousePosition) => {
  const [position, setPosition] = useState({ xCord: 0, yCord: 0 });

  useEffect(() => {
    function setFromEvent(e: { clientX: any; clientY: any }): void {
      return setPosition({ xCord: e.clientX, yCord: e.clientY });
    }
    if (divRef.current) {
      divRef.current.addEventListener("mousemove", setFromEvent);
    }

    return () => {
      if (divRef.current) {
        divRef.current.removeEventListener("mousemove", setFromEvent);
      }
    };
  });
  return position;
};

export default useMousePosition;
