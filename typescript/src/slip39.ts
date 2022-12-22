import * as slip39Helper from './slip39_helper';

const MAX_DEPTH = 2;

class Slip39Node {
  index: number;
  description: string;
  mnemonic: string;
  children: Slip39Node[];

  constructor(index = 0, description = '', mnemonic = '', children = []) {
    this.index = index;
    this.description = description;
    this.mnemonic = mnemonic;
    this.children = children;
  }

  get mnemonics(): string[] {
    if (this.children.length === 0) return [this.mnemonic];

    const result = this.children.reduce(
      (prev: string[], item: Slip39Node) => prev.concat(item.mnemonics),
      []
    );
    return result;
  }
}

// The javascript implementation of the SLIP-0039: Shamir's Secret-Sharing for Mnemonic Codes
// see: https://github.com/satoshilabs/slips/blob/master/slip-0039.md)
class Slip39 {
  // Instance members
  iterationExponent: number;
  identifier: number;
  groupCount: number;
  groupThreshold: number;

  constructor({
    iterationExponent = 0,
    identifier = 0,
    groupCount = 0,
    groupThreshold = 0,
  } = {}) {
    this.iterationExponent = iterationExponent;
    this.identifier = identifier;
    this.groupCount = groupCount;
    this.groupThreshold = groupThreshold;
  }

  static fromArray(
    masterSecret: Array<number>,
    {
      passphrase = '',
      threshold = 1,
      groups = [[1, 1, 'Default 1-of-1 group share']],
      iterationExponent = 0,
      title = 'My default slip39 shares',
    } = {}
  ): Slip39 {
    if (masterSecret.length * 8 < slip39Helper.MIN_ENTROPY_BITS) {
      throw Error(
        `The length of the master secret (${
          masterSecret.length
        } bytes) must be at least ${slip39Helper.bitsToBytes(
          slip39Helper.MIN_ENTROPY_BITS
        )} bytes.`
      );
    }

    if (masterSecret.length % 2 !== 0) {
      throw Error(
        'The length of the master secret in bytes must be an even number.'
      );
    }

    return new Slip39();
  }

  static recoverSecret(mnemonics: string[], passphrase: string): number[] {
    // TODO: fill in the implementation
    return [];
  }

  fromPath(path: string): Slip39Node {
    return new Slip39Node();
  }
}

export {Slip39 as default, Slip39};
