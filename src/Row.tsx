import React from "react";
import { ALLOWED_LETTERS } from "./constants";
import LetterSlot from "./LetterSlot";
import { erase$, newLetter$, rowStores, validationResultStores } from "./store";
import { useStore } from "@state-adapt/react";

function Row({ index }: { index: number }) {
  const currentWord = useStore(rowStores[index]).state;
  const validationResult = useStore(validationResultStores[index]).validationResult;

  return (
    <div style={{ display: "flex", outline: "none" }}>
      {[...new Array(ALLOWED_LETTERS)].map((_, letterSlotIndex) => {
        return (
          <LetterSlot
            isActive={true}
            validationResult={validationResult[letterSlotIndex]}
            currentLetter={currentWord[letterSlotIndex] || ""}
            onPressLetter={(letter: string) => newLetter$.next({ letter, row: index })}
            onDeleteLetter={() => erase$.next(index)}
            key={letterSlotIndex}
          />
        );
      })}
    </div>
  );
}

export default React.memo(Row);
