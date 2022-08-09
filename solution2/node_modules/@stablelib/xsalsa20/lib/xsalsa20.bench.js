"use strict";
// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
var xsalsa20_1 = require("./xsalsa20");
var benchmark_1 = require("@stablelib/benchmark");
var buf8192 = benchmark_1.byteSeq(8192);
var buf1111 = benchmark_1.byteSeq(1111);
var key = benchmark_1.byteSeq(32);
var nonce = benchmark_1.byteSeq(24);
benchmark_1.report("XSalsa20/20 xor 8K", benchmark_1.benchmark(function () { return xsalsa20_1.streamXOR(key, nonce, buf8192, buf8192); }, buf8192.length));
benchmark_1.report("XSalsa20/20 xor 1111", benchmark_1.benchmark(function () { return xsalsa20_1.streamXOR(key, nonce, buf1111, buf1111); }, buf1111.length));
//# sourceMappingURL=xsalsa20.bench.js.map