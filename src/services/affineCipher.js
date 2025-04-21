// Fungsi untuk menghitung FPB (Faktor Persekutuan Terbesar)
function fpb(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Fungsi untuk mencari invers modulo dari a terhadap m
function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return -1;
}

// Fungsi untuk memformat teks cipher dalam bentuk tanpa spasi dan kelompok 5 huruf
function formatCipherText(text) {
    return text.replace(/\s+/g, '');
}

// Fungsi untuk mengenkripsi teks menggunakan Affine Cipher
function encryptAffine(text, a, b) {
    if (fpb(a, 26) !== 1) {
        throw new Error("Nilai a harus coprime dengan 26");
    }
    
    let cipherText = text.toUpperCase().replace(/\s+/g, '').split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            let x = char.charCodeAt(0) - 65;
            return String.fromCharCode(((a * x + b) % 26) + 65);
        }
        return '';
    }).join('');
    
    return formatCipherText(cipherText);
}

// Fungsi untuk mendekripsi teks yang telah dienkripsi dengan Affine Cipher
function decryptAffine(text, a, b) {
    let a_inv = modInverse(a, 26);
    if (a_inv === -1) {
        throw new Error("Nilai a tidak memiliki invers modulo 26");
    }
    
    let decryptedText = text.replace(/\s+/g, '').split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            let y = char.charCodeAt(0) - 65; 
            return String.fromCharCode(((a_inv * (y - b + 26)) % 26) + 65); 
        }
        return '';
    }).join('');
    
    return decryptedText; 
}

module.exports = { encryptAffine, decryptAffine };