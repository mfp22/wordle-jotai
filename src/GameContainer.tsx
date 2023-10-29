import React, { useEffect, useRef } from "react";
import Keyboard from "./Keyboard";
import Row from "./Row";
import { useAtomValue, useSetAtom } from "jotai";
import { currentRowAtom } from "./store";
import { ALLOWED_ATTEMPTS, LOWER_ALPHABET, UPPER_ALPHABET } from "./constants";
import BindKeys from "react-bind-keys";

export default function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberOfRows = useAtomValue(numberOfRowsAtom);
  const { performWordValidationAtom, setLetterAtom, deleteLetterAtom } =
    useAtomValue(currentRowAtom);

  const performWordValidation = useSetAtom(performWordValidationAtom);
  const deleteLetter = useSetAtom(deleteLetterAtom);
  const setLetter = useSetAtom(setLetterAtom);

  const keyHandlers = {
    SUBMIT: performWordValidation,
    DELETE_LETTER: deleteLetter,
    SET_LETTER: (e: React.KeyboardEvent) => {
      setLetter(e.key);
    },
    NOOP: () => {},
  };

  const keyMap = {
    SET_LETTER: [...LOWER_ALPHABET, ...UPPER_ALPHABET],
    DELETE_LETTER: ["backspace"],
    SUBMIT: ["enter"],
    NOOP: ["meta+r"],
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <BindKeys keyMap={keyMap} keyHandlers={keyHandlers}>
      <div ref={containerRef} tabIndex={-1} style={{ outline: "none" }}>
        {[...new Array(ALLOWED_ATTEMPTS)].map((_, index) => {
          return <Row index={index} key={index} />;
        })}
        <Keyboard deleteLetter={deleteLetter} setLetter={setLetter} />
      </div>
    </BindKeys>
  );
}
