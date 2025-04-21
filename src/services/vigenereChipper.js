function vigenereEncrypt(plaintext, key) {
    let ciphertext = "";
    key = key.toUpperCase(); // Jadikan key huruf kapital
    let keyLength = key.length;

    for (let i = 0, j = 0; i < plaintext.length; i++) {
        let char = plaintext[i];

        if (char.match(/[a-z]/i)) {
            let shift = key.charCodeAt(j % keyLength) - 65; // karena kapital
            let upperChar = char.toUpperCase();
            ciphertext += String.fromCharCode((upperChar.charCodeAt(0) - 65 + shift) % 26 + 65);
            j++;
        }
    }

    return ciphertext;
}

function vigenereDecrypt(ciphertext, key) {
    let plaintext = "";
    key = key.toUpperCase(); // Jadikan key huruf kapital
    let keyLength = key.length;

    for (let i = 0, j = 0; i < ciphertext.length; i++) {
        let char = ciphertext[i];

        if (char.match(/[a-z]/i)) {
            let shift = key.charCodeAt(j % keyLength) - 65; // karena kapital
            let upperChar = char.toUpperCase();
            plaintext += String.fromCharCode((upperChar.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
            j++;
        }
    }

    return plaintext;
}

module.exports = { vigenereEncrypt, vigenereDecrypt };