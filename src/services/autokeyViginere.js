const charToIndex = (char) => char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

const indexToChar = (index) => {
    return String.fromCharCode((index % 26) + 'A'.charCodeAt(0));
};

const encryptAutokeyVigenere = (plaintext, key) => {
    plaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let ciphertext = '';

    const newPlainText = plaintext.slice(0, -key.length)
    let fullKey = key + newPlainText;

    for (let i = 0; i < plaintext.length; i++) {
        let p = charToIndex(plaintext[i]);
        let k = charToIndex(fullKey[i]);
        let c = (p + k) % 26;
        
        ciphertext += indexToChar(c);
    }

    console.log(fullKey);

    return ciphertext;
}

const decryptAutokeyVigenere = (ciphertext, key) => {
    let plaintext = "";
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
    let keyIndex = 0;
    let fullKey = key;

    for (let i = 0; i < ciphertext.length; i++) {
        let char = ciphertext[i];

        if (char.match(/[a-zA-Z]/)) {
            let c = charToIndex(char);
            let k = charToIndex(fullKey[keyIndex]);
            let p = (c - k + 26) % 26;
            let decryptedChar = indexToChar(p);

            plaintext += decryptedChar;
            fullKey += decryptedChar;
            keyIndex++;
        }
    }

    return plaintext;
};

module.exports = { encryptAutokeyVigenere, decryptAutokeyVigenere };