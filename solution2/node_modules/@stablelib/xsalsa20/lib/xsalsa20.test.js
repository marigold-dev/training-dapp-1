"use strict";
// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
var xsalsa20_1 = require("./xsalsa20");
var hex_1 = require("@stablelib/hex");
describe("xsalsa20.hsalsa", function () {
    it("should produce correct value", function () {
        var key = hex_1.decode("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F");
        var src = hex_1.decode("FFFEFDFCFBFAF9F8F7F6F5F4F3F2F1F0");
        var good = "C6CB53882782B5B86DF1AB2ED9B810EC8A88C0A7F29211E693F0019FE0728858";
        var dst = new Uint8Array(32);
        expect(hex_1.encode(xsalsa20_1.hsalsa(key, src, dst))).toBe(good);
    });
});
describe("xsalsa20.stream", function () {
    it("should produce correct result", function () {
        var key = hex_1.decode("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F");
        var nonce = hex_1.decode("FFFEFDFCFBFAF9F8F7F6F5F4F3F2F1F0EFEEEDECEBEAE9E8");
        var good = "300885CCE813D8CDBE05F89706F9D5557041E4FADC3EBC5DB89C6CA60F7" +
            "3EDE4F91FF1F9521D3E9AF058E037E7FD0601DB9CCBD7A9F5CED151426F" +
            "DE32FC544F4F95576E2614377049C258664845A93D5FF5DD479CFEB55C7" +
            "579B60D419B8A8C03DA3494993577B4597DCB658BE52AB7";
        var dst = new Uint8Array(good.length / 2);
        expect(hex_1.encode(xsalsa20_1.stream(key, nonce, dst))).toBe(good);
    });
});
// TODO(dchest): test nonceInplaceCounterLength
//# sourceMappingURL=xsalsa20.test.js.map