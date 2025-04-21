function extendedVigenereEncrypt(input, key) {
    // Ensure input is a string or Uint8Array
    if (typeof input === "object" && Array.isArray(input)) {
        input = Uint8Array.from(input); // Convert array to Uint8Array
    }
    if (!(input instanceof Uint8Array || typeof input === "string")) {
        throw new Error("Input must be a string or Uint8Array.");
    }
    if (typeof key !== "string" || key.length === 0) {
        throw new Error("Key must be a non-empty string.");
    }

    const isBinary = input instanceof Uint8Array;
    const inputArray = isBinary ? input : Uint8Array.from(input, char => char.charCodeAt(0));
    const keyArray = Uint8Array.from(key, char => char.charCodeAt(0));
    const keyLength = keyArray.length;

    const outputArray = inputArray.map((byte, i) => {
        const kI = keyArray[i % keyLength];
        return (byte + kI) % 256;
    });

    // Return array for binary or string for text
    return isBinary ? Array.from(outputArray) : String.fromCharCode(...outputArray);
}

function extendedVigenereDecrypt(input, key) {
    // Ensure input is a string or Uint8Array
    if (typeof input === "object" && Array.isArray(input)) {
        input = Uint8Array.from(input); // Convert array to Uint8Array
    }
    if (!(input instanceof Uint8Array || typeof input === "string")) {
        throw new Error("Input must be a string or Uint8Array.");
    }
    if (typeof key !== "string" || key.length === 0) {
        throw new Error("Key must be a non-empty string.");
    }

    const isBinary = input instanceof Uint8Array;
    const inputArray = isBinary ? input : Uint8Array.from(input, char => char.charCodeAt(0));
    const keyArray = Uint8Array.from(key, char => char.charCodeAt(0));
    const keyLength = keyArray.length;

    const outputArray = inputArray.map((byte, i) => {
        const kI = keyArray[i % keyLength];
        return (byte - kI + 256) % 256;
    });

    return isBinary ? Array.from(outputArray) : String.fromCharCode(...outputArray);
}

module.exports = { extendedVigenereEncrypt, extendedVigenereDecrypt };