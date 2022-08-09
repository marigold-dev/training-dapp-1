"use strict";
// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Package salsa20 implements Salsa20 stream cipher.
 */
var binary_1 = require("@stablelib/binary");
var wipe_1 = require("@stablelib/wipe");
// Number of Salsa20 rounds (Salsa20/20).
var ROUNDS = 20;
/**
 * Applies the Salsa20 core function to 16-byte input,
 * 32-byte key key, and puts the result into 64-byte array out.
 */
function core(out, input, key) {
    var j0 = 0x61707865; // "expa"
    var j1 = (key[3] << 24) | (key[2] << 16) | (key[1] << 8) | key[0];
    var j2 = (key[7] << 24) | (key[6] << 16) | (key[5] << 8) | key[4];
    var j3 = (key[11] << 24) | (key[10] << 16) | (key[9] << 8) | key[8];
    var j4 = (key[15] << 24) | (key[14] << 16) | (key[13] << 8) | key[12];
    var j5 = 0x3320646E; // "nd 3"
    var j6 = (input[3] << 24) | (input[2] << 16) | (input[1] << 8) | input[0];
    var j7 = (input[7] << 24) | (input[6] << 16) | (input[5] << 8) | input[4];
    var j8 = (input[11] << 24) | (input[10] << 16) | (input[9] << 8) | input[8];
    var j9 = (input[15] << 24) | (input[14] << 16) | (input[13] << 8) | input[12];
    var j10 = 0x79622D32; // "2-by"
    var j11 = (key[19] << 24) | (key[18] << 16) | (key[17] << 8) | key[16];
    var j12 = (key[23] << 24) | (key[22] << 16) | (key[21] << 8) | key[20];
    var j13 = (key[27] << 24) | (key[26] << 16) | (key[25] << 8) | key[24];
    var j14 = (key[31] << 24) | (key[30] << 16) | (key[29] << 8) | key[28];
    var j15 = 0x6B206574; // "te k"
    var x0 = j0;
    var x1 = j1;
    var x2 = j2;
    var x3 = j3;
    var x4 = j4;
    var x5 = j5;
    var x6 = j6;
    var x7 = j7;
    var x8 = j8;
    var x9 = j9;
    var x10 = j10;
    var x11 = j11;
    var x12 = j12;
    var x13 = j13;
    var x14 = j14;
    var x15 = j15;
    var u;
    for (var i = 0; i < ROUNDS; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> (32 - 7);
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> (32 - 13);
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);
        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> (32 - 7);
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> (32 - 13);
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);
        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> (32 - 7);
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> (32 - 13);
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);
        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> (32 - 7);
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> (32 - 13);
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);
        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> (32 - 7);
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> (32 - 13);
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);
        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> (32 - 7);
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> (32 - 13);
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);
        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> (32 - 7);
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> (32 - 13);
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);
        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> (32 - 7);
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> (32 - 13);
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);
    }
    binary_1.writeUint32LE(x0 + j0 | 0, out, 0);
    binary_1.writeUint32LE(x1 + j1 | 0, out, 4);
    binary_1.writeUint32LE(x2 + j2 | 0, out, 8);
    binary_1.writeUint32LE(x3 + j3 | 0, out, 12);
    binary_1.writeUint32LE(x4 + j4 | 0, out, 16);
    binary_1.writeUint32LE(x5 + j5 | 0, out, 20);
    binary_1.writeUint32LE(x6 + j6 | 0, out, 24);
    binary_1.writeUint32LE(x7 + j7 | 0, out, 28);
    binary_1.writeUint32LE(x8 + j8 | 0, out, 32);
    binary_1.writeUint32LE(x9 + j9 | 0, out, 36);
    binary_1.writeUint32LE(x10 + j10 | 0, out, 40);
    binary_1.writeUint32LE(x11 + j11 | 0, out, 44);
    binary_1.writeUint32LE(x12 + j12 | 0, out, 48);
    binary_1.writeUint32LE(x13 + j13 | 0, out, 52);
    binary_1.writeUint32LE(x14 + j14 | 0, out, 56);
    binary_1.writeUint32LE(x15 + j15 | 0, out, 60);
}
/**
 * Encrypt src with Salsa20/20 stream generated for the given 32-byte key
 * and 8-byte and write the result into dst and return it.
 *
 * dst and src may be the same, but otherwise must not overlap.
 *
 * Never use the same key and nonce to encrypt more than one message.
 *
 * If nonceInplaceCounterLength is not 0, the nonce is assumed to be a 16-byte
 * array with stream counter in first nonceInplaceCounterLength bytes and nonce
 * in the last remaining bytes. The counter will be incremented inplace for
 * each Salsa20 block. This is useful if you need to encrypt one stream of data
 * in chunks.
 */
function streamXOR(key, nonce, src, dst, nonceInplaceCounterLength) {
    if (nonceInplaceCounterLength === void 0) { nonceInplaceCounterLength = 0; }
    // We only support 256-bit keys.
    if (key.length !== 32) {
        throw new Error("Salsa20: key size must be 32 bytes");
    }
    if (dst.length < src.length) {
        throw new Error("Salsa20: destination is shorter than source");
    }
    var nc;
    var counterStart;
    if (nonceInplaceCounterLength === 0) {
        if (nonce.length !== 8) {
            throw new Error("Salsa20 nonce must be 8 bytes");
        }
        nc = new Uint8Array(16);
        // First bytes of nc are nonce, set it.
        nc.set(nonce);
        // Last bytes are counter.
        counterStart = nonce.length;
    }
    else {
        if (nonce.length !== 16) {
            throw new Error("Salsa20 nonce with counter must be 16 bytes");
        }
        // This will update passed nonce with counter inplace.
        nc = nonce;
        counterStart = 16 - nonceInplaceCounterLength;
    }
    // Allocate temporary space for Salsa20 block.
    var block = new Uint8Array(64);
    for (var i = 0; i < src.length; i += 64) {
        // Generate a block.
        core(block, nc, key);
        // XOR block bytes with src into dst.
        for (var j = i; j < i + 64 && j < src.length; j++) {
            dst[j] = src[j] ^ block[j - i];
        }
        // Increment counter.
        incrementCounter(nc, counterStart, nc.length - counterStart);
    }
    // Cleanup temporary space.
    wipe_1.wipe(block);
    if (nonceInplaceCounterLength === 0) {
        // Cleanup counter.
        wipe_1.wipe(nc);
    }
    return dst;
}
exports.streamXOR = streamXOR;
/**
 * Generate Salsa20/20 stream for the given 32-byte key and 8-byte nonce
 * and write it into dst and return it.
 *
 * Never use the same key and nonce to generate more than one stream.
 *
 * If nonceInplaceCounterLength is not 0, it behaves the same
 * with respect to the nonce as described in streamXOR documentation.
 *
 * stream is like streamXOR with all-zero src.
 */
function stream(key, nonce, dst, nonceInplaceCounterLength) {
    if (nonceInplaceCounterLength === void 0) { nonceInplaceCounterLength = 0; }
    wipe_1.wipe(dst);
    return streamXOR(key, nonce, dst, dst, nonceInplaceCounterLength);
}
exports.stream = stream;
function incrementCounter(counter, pos, len) {
    var carry = 1;
    while (len--) {
        carry = carry + (counter[pos] & 0xff) | 0;
        counter[pos] = carry & 0xff;
        carry >>>= 8;
        pos++;
    }
    if (carry > 0) {
        throw new Error("Salsa20: counter overflow");
    }
}
//# sourceMappingURL=salsa20.js.map