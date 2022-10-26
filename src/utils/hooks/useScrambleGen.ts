import { useEffect, useState } from "react";

const notationGroups = [
  ["R", "L", "F", "B", "U", "D"],
  ["R'", "L'", "F'", "B'", "U'", "D'"],
  ["R2", "L2", "F2", "B2", "U2", "D2"],
];

const genScrambles = (scrambleCount: number): Array<string[]> => {
  const generated: Array<string[]> = [];

  for (let i = 0; i < scrambleCount; i++) {
    let lastCol = notationGroups[0]?.length ?? 0;
    let beforeLastCol = notationGroups[0]?.length ?? 0;
    const scramble = [];

    for (let j = 0; j < 13; j++) {
      let pickGroup = 0;
      pickGroup = Math.floor(Math.random() * notationGroups.length);
      let pickCol = Math.floor(
        Math.random() * (notationGroups[pickGroup]?.length ?? 0)
      );
      let isCommutative = lastCol / 2 == beforeLastCol / 2;
      while (
        pickCol == lastCol ||
        (isCommutative && pickCol == beforeLastCol)
      ) {
        pickCol = Math.floor(
          Math.random() * (notationGroups[pickGroup]?.length ?? 0)
        );
        isCommutative = lastCol / 2 == beforeLastCol / 2;
      }
      const provisionalMoveGroup = notationGroups[pickGroup];
      if (provisionalMoveGroup) {
        const provisionalMove = provisionalMoveGroup[pickCol];
        if (provisionalMove) {
          scramble.push(provisionalMove);
        }
      }
      beforeLastCol = lastCol;
      lastCol = pickCol;
    }
    generated.push(scramble);
  }
  return generated;
};

export const useScrambleGen = (
  scrambleCount: number
): [string[], () => void] => {
  const [scrambles, setScrambles] = useState<Array<string[]>>([]);

  useEffect(() => {
    setScrambles(genScrambles(scrambleCount));
  }, [scrambleCount]);

  const [currentScramble, setCurrentScramble] = useState(0);

  const next = () => {
    if (currentScramble + 1 == scrambles.length) {
      setScrambles((prev) => [...prev, ...genScrambles(scrambleCount)]);
    }
    setCurrentScramble((prev) => prev + 1);
  };

  return [scrambles[currentScramble] ?? [], next];
};
