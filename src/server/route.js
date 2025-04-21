const { autokeyVigenereHandler, affineCipherHandler, hillCipherHandler, vigenereCipherHandler, playfairCipherHandler, extendedVigenereHandler } = require("./handler")

const routes = [
    {
        method: "POST",
        path: "/autokeyVigenere",
        handler: autokeyVigenereHandler,
    },
    {
        method:"POST",
        path: "/affineCipher",
        handler: affineCipherHandler,
    },
    {
        method: "POST",
        path: "/hillCipher",
        handler: hillCipherHandler,
    },
    {
        method: "POST",
        path: "/vigenereCipher",
        handler: vigenereCipherHandler,
    },
    {
        method: "POST",
        path: "/playFairCipher",
        handler: playfairCipherHandler,
    },
    {
        method: "POST",
        path: "/extendedVigenere",
        handler: extendedVigenereHandler,
    }
]

module.exports = routes