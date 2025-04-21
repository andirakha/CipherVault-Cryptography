const { encryptAffine, decryptAffine } = require("../services/affineCipher");
const { encryptAutokeyVigenere, decryptAutokeyVigenere } = require("../services/autokeyViginere");
const { extendedVigenereEncrypt, extendedVigenereDecrypt } = require("../services/extendedVigenereCipher");
const { hillEncrypt, hillDecrypt } = require("../services/hillCipher");
const { playfairCipher, decryptPlayfairCipher } = require("../services/playFairCipher");
const { vigenereEncrypt, vigenereDecrypt } = require("../services/vigenereChipper")

const autokeyVigenereHandler = (request, h) => {
    const value = request.payload;
    if (value.method === "encrypt") {
        if (!value.plainText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = encryptAutokeyVigenere(value.plainText, value.key);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = decryptAutokeyVigenere(value.cipherText, value.key);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

const affineCipherHandler = (request, h) => {
    const value = request.payload;
    console.log(value);
    if (value.method === "encrypt") {
        if (!value.plainText || !value.multiplicationKey || !value.additionKey) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = encryptAffine(value.plainText, value.multiplicationKey, value.additionKey);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.multiplicationKey || !value.additionKey) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = decryptAffine(value.cipherText, value.multiplicationKey, value.additionKey);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

const hillCipherHandler = (request, h) => {
    const value = request.payload;
    if (value.method === "encrypt") {
        if (!value.plainText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = hillEncrypt(value.plainText, value.key);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = hillDecrypt(value.cipherText, value.key);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

const vigenereCipherHandler = (request, h) => {
    const value = request.payload;
    if (value.method === "encrypt") {
        if (!value.plainText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = vigenereEncrypt(value.plainText, value.key);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = vigenereDecrypt(value.cipherText, value.key);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

const playfairCipherHandler = (request, h) => {
    const value = request.payload;
    if (value.method === "encrypt") {
        if (!value.plainText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = playfairCipher(value.plainText, value.key);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = decryptPlayfairCipher(value.cipherText, value.key);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

const extendedVigenereHandler = (request, h) => {
    const value = request.payload;
    if (value.method === "encrypt") {
        if (!value.plainText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const cipherText = extendedVigenereEncrypt(value.plainText, value.key);
        return h.response({
            status: "success",
            message: "text successfully encrypted",
            cipherText: cipherText,
        });
    } 
    else {
        if (!value.cipherText || !value.key) {
            throw new Error("missing value, please fill all field");
        }
        const plainText = extendedVigenereDecrypt(value.cipherText, value.key);
        return h.response({
            status: "success",
            message: "text successfully descrypted",
            plainText: plainText,
        });
    }
}

module.exports = { autokeyVigenereHandler, affineCipherHandler, hillCipherHandler, vigenereCipherHandler, playfairCipherHandler, extendedVigenereHandler };