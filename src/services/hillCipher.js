function parseKey(keyString) {
    return JSON.parse(keyString);
}

function charToNum(char) {
    return char.charCodeAt(0) - 65; // 'A' = 0, ..., 'Z' = 25
}

function numToChar(num) {
    return String.fromCharCode((num % 26 + 26) % 26 + 65);
}

function textToVector(text, n) {
    let charData = [];
    let vector = [];

    for (let char of text.toUpperCase()) {
        if (char >= 'A' && char <= 'Z') {
            charData.push(char);
            vector.push(charToNum(char));
        }
    }

    while (vector.length % n !== 0) {
        vector.push(charToNum('X')); // Padding dengan 'X'
        charData.push('X');
    }

    return { vector, charData };
}

function vectorToText(vector, charData) {
    return vector.map((num) => numToChar(num)).join("");
}

function matrixMultiply(A, B, mod) {
    let result = Array(A.length)
        .fill(0)
        .map(() => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
            result[i][j] = (result[i][j] % mod + mod) % mod;
        }
    }
    return result;
}

function modInverse(n, mod) {
    for (let x = 1; x < mod; x++) {
        if ((n * x) % mod === 1) return x;
    }
    return null;
}

function matrixModInverse(matrix, mod) {
    let size = matrix.length;
    let identity = Array(size)
        .fill(0)
        .map((_, i) =>
            Array(size)
                .fill(0)
                .map((_, j) => (i === j ? 1 : 0))
        );

    let augmented = matrix.map((row, i) => [...row, ...identity[i]]);

    for (let i = 0; i < size; i++) {
        let pivot = augmented[i][i];
        let pivotInv = modInverse(pivot, mod);
        if (pivotInv === null) {
            let swapped = false;
            for (let r = i + 1; r < size; r++) {
                pivot = augmented[r][i];
                pivotInv = modInverse(pivot, mod);
                if (pivotInv !== null) {
                    [augmented[i], augmented[r]] = [augmented[r], augmented[i]];
                    swapped = true;
                    break;
                }
            }
            if (!swapped) throw new Error("Key tidak memiliki invers modular!");
        }

        for (let j = 0; j < size * 2; j++) {
            augmented[i][j] = (augmented[i][j] * pivotInv) % mod;
            if (augmented[i][j] < 0) augmented[i][j] += mod;
        }

        for (let k = 0; k < size; k++) {
            if (k === i) continue;
            let factor = augmented[k][i];
            for (let j = 0; j < size * 2; j++) {
                augmented[k][j] = (augmented[k][j] - factor * augmented[i][j]) % mod;
                if (augmented[k][j] < 0) augmented[k][j] += mod;
            }
        }
    }

    return augmented.map(row => row.slice(size));
}

function hillEncrypt(plainText, keyString) {
    let keyMatrix = parseKey(keyString);
    let n = keyMatrix.length;
    let { vector, charData } = textToVector(plainText, n);
    let encryptedVector = [];

    for (let i = 0; i < vector.length; i += n) {
        let block = vector.slice(i, i + n).map((x) => [x]);
        let encryptedBlock = matrixMultiply(keyMatrix, block, 26); // sebelumnya 95
        encryptedVector.push(...encryptedBlock.flat());
    }

    return vectorToText(encryptedVector, charData);
}

function hillDecrypt(cipherText, keyString) {
    let keyMatrix = parseKey(keyString);
    let n = keyMatrix.length;
    let { vector, charData } = textToVector(cipherText, n);
    let keyInv = matrixModInverse(keyMatrix, 26); // sebelumnya 95
    let decryptedVector = [];

    for (let i = 0; i < vector.length; i += n) {
        let block = vector.slice(i, i + n).map((x) => [x]);
        let decryptedBlock = matrixMultiply(keyInv, block, 26);
        decryptedVector.push(...decryptedBlock.flat());
    }

    return vectorToText(decryptedVector, charData);
}

module.exports = { hillEncrypt, hillDecrypt };
