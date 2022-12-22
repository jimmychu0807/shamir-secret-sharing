import {expect} from 'chai';
import {slip39} from '../src';

const MASTERSECRET = 'ABCDEFGHIJKLMNOP';
const MS = MASTERSECRET.slip39EncodeHex();
const PASSPHRASE = 'TREZOR';
const ONE_GROUP = [[5, 7]];

const slip15 = slip39.fromArray(MS, {
  passphrase: PASSPHRASE,
  threshold: 1,
  groups: ONE_GROUP,
});

const slip15NoPW = slip39.fromArray(MS, {
  threshold: 1,
  groups: ONE_GROUP,
});

// Shuffle function
function shuffle<T>(array: Array<T>): void {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Combination C(n, k) of the groups
function getCombinations<T>(array: Array<T>, k: number): T[][] {
  const result: T[][] = [];
  const combinations: Array<T> = [];

  function helper(level: number, start: number) {
    for (let i = start; i < array.length - k + level + 1; i++) {
      combinations[level] = array[i];

      if (level < k - 1) {
        helper(level + 1, i + 1);
      } else {
        result.push(combinations.slice(0));
      }
    }
  }

  helper(0, 0);
  return result;
}

describe('Basic Tests', () => {
  describe('Test threshold 1 with 5 of 7 shares of a group combinations', () => {
    const mnemonics = slip15.fromPath('r/0').mnemonics;
    const combinations = getCombinations([0, 1, 2, 3, 4, 5, 6], 5);

    combinations.forEach(item => {
      shuffle(item);

      const description = `Test shuffled combination ${item.join(' ')}.`;
      it(description, () => {
        const shares = item.map(el => mnemonics[el]);
        expect(MS.slip39DecodeHex()).eq(
          slip39.recoverSecret(shares, PASSPHRASE).slip39DecodeHex()
        );
      });
    });
  });
});
