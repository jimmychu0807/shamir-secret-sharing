import * as crypto from 'crypto';

// The length of the radix in bits.
const RADIX_BITS = 10;

// The length of the random identifier in bits.
const ID_BITS_LENGTH = 15;

// The length of the iteration exponent in bits.
const ITERATION_EXP_BITS_LENGTH = 5;

// The length of the random identifier and iteration exponent in words.
const ITERATION_EXP_WORDS_LENGTH = parseInt(
  String(
    (ID_BITS_LENGTH + ITERATION_EXP_BITS_LENGTH + RADIX_BITS - 1) / RADIX_BITS
  ),
  10
);

// The maximum iteration exponent
const MAX_ITERATION_EXP = Math.pow(2, ITERATION_EXP_BITS_LENGTH);

// The maximum number of shares that can be created
const MAX_SHARE_COUNT = 16;

// The length of the RS1024 checksum in words.
const CHECKSUM_WORDS_LENGTH = 3;

// The length of the digest of the shared secret in bytes.
const DIGEST_LENGTH = 4;

// The customization string used in the RS1024 checksum and in the PBKDF2 salt.
const SALT_STRING = 'shamir';

// The minimum allowed entropy of the master secret
const MIN_ENTROPY_BITS = 128;

// The minimum allowed length of the mnemonic in words
const METADATA_WORDS_LENGTH =
  ITERATION_EXP_WORDS_LENGTH + 2 + CHECKSUM_WORDS_LENGTH;

// The length of the mnemonic in words without the share values.
const MNEMONICS_WORDS_LENGTH = parseInt(
  String(
    METADATA_WORDS_LENGTH + (MIN_ENTROPY_BITS + RADIX_BITS - 1) / RADIX_BITS
  ),
  10
);

// The minimum number of iterations to use in PBKDF2.
const ITERATION_COUNT = 10000;

// The number of rounds to use in the Feistel cipher.
const ROUND_COUNT = 4;

// The index of the share containing the digest of the shared secret.
const DIGEST_INDEX = 254;

// The index of the share containing the shared secret.
const SECRET_INDEX = 255;

declare global {
  interface String {
    slip39EncodeHex(): number[];
  }

  interface Array<T> {
    slip39DecodeHex(): string;
    slip39Generate(
      m: number | undefined,
      v: (i: number) => number
    ): Array<number>;
    toHexString(): string;
  }
}

String.prototype.slip39EncodeHex = function (): number[] {
  return this.split('').map(c => c.charCodeAt(0));
};

Array.prototype.slip39DecodeHex = function (): string {
  return String.fromCharCode(...this);
};

// TODO: not sure if this is correct
Array.prototype.slip39Generate = function (m, v): Array<number> {
  const n = m || this.length;
  for (let i = 0; i < n; i++) {
    this[i] = v(i);
  }
  return this;
};

Array.prototype.toHexString = function () {
  return this.map(byte => '0' + (byte & 0xff).toString(16).slice(-2)).join('');
};

const BIGINT_WORD_BITS = BigInt(8);

function bitsToBytes(n: number): number {
  const res: number = (n + 7) / 8;
  const b = parseInt(res.toString(), RADIX_BITS);
  return b;
}

export {MIN_ENTROPY_BITS, bitsToBytes};
