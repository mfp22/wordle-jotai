import { WORDS } from "./wordlist";
import { ALLOWED_ATTEMPTS, ALLOWED_LETTERS, ValidationResult } from "./constants";
import { adapt } from "./state-adapt";
import { Source, joinStores, toSource } from "@state-adapt/rxjs";
import { Subject, filter, tap } from "rxjs";
import { createAdapter } from "@state-adapt/core";

function getNumberOfDays(start: Date, end: Date) {
  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = start.getTime() - end.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return Math.abs(diffInDays);
}
const startDate = new Date("2/4/2022");
const currentDate = new Date();
export const word = WORDS[getNumberOfDays(startDate, currentDate)];

export const erase$ = new Source<number>("erase$");
export const newLetter$ = new Source<{ letter: string; row: number }>("newLetter$");
export const submit$ = new Subject<string>();

export const currentRowIndexStore = adapt(0, {
  adapter: {
    increment: state => Math.min(ALLOWED_ATTEMPTS - 1, state + 1),
  },
  sources: {
    increment: submit$.pipe(
      tap(w => console.log("submit$", w, word)),
      filter(row => WORDS.indexOf(row) !== -1),
      toSource("validSumission$")
    ),
  },
  path: "currentRowIndex",
});

const rowAdapter = createAdapter<string>()({
  addLetter: (state, { letter }) => (state.length >= ALLOWED_LETTERS ? state : `${state}${letter}`),
  deleteLetter: state => state.slice(0, state.length - 1),
});
export const rowStores = new Array(ALLOWED_ATTEMPTS).fill("").map((el, i) =>
  adapt("", {
    adapter: rowAdapter,
    sources: {
      addLetter: newLetter$.pipe(filter(({ payload }) => payload.row === i)),
      deleteLetter: erase$.pipe(filter(({ payload }) => payload === i)),
    },
    path: `row.${i}`,
  })
);
export const validationResultStores = rowStores.map((store, i) =>
  joinStores({
    currentRowIndex: currentRowIndexStore,
    row: store,
  })({
    validationResult: s => (s.currentRowIndex > i ? getValidationResult(word, s.row) : []),
  })()
);

const getValidationResult = (actualWord: string, testWord: string): ValidationResult[] => {
  const claimed = new Array(actualWord.length);
  const testLetters = testWord.split("");
  const actualLetters = actualWord.split("");
  testLetters.forEach((letter, i) => (claimed[i] = letter === actualLetters[i]));

  return testLetters.map((letter, index) => {
    if (actualWord[index] === letter) {
      return ValidationResult.PerfectLetter;
    }
    const matchedIndex = actualLetters.findIndex(
      (actualLetter, i) => actualLetter === letter && !claimed[i]
    );
    if (matchedIndex !== -1) {
      claimed[matchedIndex] = true;
      return ValidationResult.CorrectLetter;
    }
    return ValidationResult.WrongLetter;
  });
};
