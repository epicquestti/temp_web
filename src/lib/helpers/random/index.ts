import { commomNumbers, lowerAlphabet, upperAlphabet } from "../base";

const generateRandomNumber = (): number => {
  return parseInt(`${Math.random() * (999999 - 1) + 1}`);
};

const generateRandomRangeNumber = (min: number, max: number): number => {
  return parseInt(`${Math.random() * (max - min) + min}`);
};

const generateRandomString = (preText?: string): string => {
  return `${preText}${Math.random() * (999999 - 1) + 1}`;
};

const generateKey = (keySize?: number): string => {
  let newKey = "";
  let rounds = 26;

  if (keySize) rounds = keySize;

  for (let i = 0; i < rounds; i++) {
    const typeCharacter = generateRandomRangeNumber(0, 3);

    if (typeCharacter === 0) {
      const indexCharacters = generateRandomRangeNumber(
        0,
        lowerAlphabet.length
      );
      newKey += lowerAlphabet[indexCharacters];
    }

    if (typeCharacter === 1) {
      const indexCharacters = generateRandomRangeNumber(
        0,
        upperAlphabet.length
      );
      newKey += upperAlphabet[indexCharacters];
    }

    if (typeCharacter === 2) {
      const indexCharacters = generateRandomRangeNumber(
        0,
        commomNumbers.length
      );
      newKey += commomNumbers[indexCharacters];
    }
  }

  return newKey;
};

const generateUpperRandomString = (keySize?: number): string => {
  let newKey = "";
  let rounds = 26;

  if (keySize) rounds = keySize;

  for (let i = 0; i < rounds; i++) {
    const indexCharacters = generateRandomRangeNumber(0, upperAlphabet.length);
    newKey += upperAlphabet[indexCharacters];
  }

  return newKey;
};

const generateLowerRandomString = (keySize?: number): string => {
  let newKey = "";
  let rounds = 26;

  if (keySize) rounds = keySize;

  for (let i = 0; i < rounds; i++) {
    const indexCharacters = generateRandomRangeNumber(0, lowerAlphabet.length);
    newKey += lowerAlphabet[indexCharacters];
  }

  return newKey;
};

const generateRecoveryPasswordKey = (): string => {
  let newKey = "";
  for (let i = 0; i < 5; i++) {
    newKey += generateRandomRangeNumber(0, 9);
  }
  return newKey;
};

export {
  generateKey,
  generateLowerRandomString,
  generateRandomNumber,
  generateRandomRangeNumber,
  generateRandomString,
  generateRecoveryPasswordKey,
  generateUpperRandomString,
};
