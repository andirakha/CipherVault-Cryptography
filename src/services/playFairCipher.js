function generatePlayfairMatrix(key) {
    key = key.toUpperCase().replace(/J/g, 'I');
    let seen = new Set();
    // let matrix = [];
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

    let filteredKey = "";
    for (let char of key) {
        if (alphabet.includes(char) && !seen.has(char)) {
            seen.add(char);
            filteredKey += char;
        }
    }

    for (let char of alphabet) {
        if (!seen.has(char)) {
            seen.add(char);
            filteredKey += char;
        }
    }

    let grid = [];
    for (let i = 0; i < 25; i += 5) {
        grid.push(filteredKey.slice(i, i + 5).split(""));
    }
    return grid;
}

function findPosition(matrix, letter) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === letter) return [row, col];
        }
    }
    return null;
}

function prepareText(text) {
    text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let prepared = "";
    for (let i = 0; i < text.length; i++) {
        prepared += text[i];
        if (i < text.length - 1 && text[i] === text[i + 1]) {
            prepared += 'X';
        }
    }
    if (prepared.length % 2 !== 0) prepared += 'X';
    return prepared;
}

function playfairCipher(text, key, encrypt = true) {
    let matrix = generatePlayfairMatrix(key);
    // Use preparedText for encryption only; for decryption, use text directly.
    let processedText = encrypt ? prepareText(text) : text;
    let result = "";

    for (let i = 0; i < processedText.length; i += 2) {
        let [r1, c1] = findPosition(matrix, processedText[i]);
        let [r2, c2] = findPosition(matrix, processedText[i + 1]);

        if (r1 === r2) {
            c1 = (c1 + (encrypt ? 1 : 4)) % 5;
            c2 = (c2 + (encrypt ? 1 : 4)) % 5;
        } else if (c1 === c2) {
            r1 = (r1 + (encrypt ? 1 : 4)) % 5;
            r2 = (r2 + (encrypt ? 1 : 4)) % 5;
        } else {
            [c1, c2] = [c2, c1];
        }

        result += matrix[r1][c1] + matrix[r2][c2];
    }
    return result;
}

// function formatInBlocks(text, blockSize = 5) {
//     return text.replace(/(.{5})/g, '$1 ').trim();
// }

function decryptPlayfairCipher(text, key) {
    return playfairCipher(text, key, false);
}

// function textToBinary(text) {
//     return text.split("").map(char => {
//         return char.charCodeAt(0).toString(2).padStart(8, "0");
//     }).join(" ");
// }

module.exports = {playfairCipher, decryptPlayfairCipher };