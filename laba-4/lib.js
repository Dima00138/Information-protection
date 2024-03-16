
function insertInfoWordToMatrix(infoWord, k1, k2, z) {
    const k = Math.ceil(infoWord.length/k1);
    const matrix = Array(k).fill().map(() => Array(k2+1).fill().map(() => Array(z+1).fill(0)));

    for (let i = 0; i < k1-1; i++) {
        console.log("Row " + (i + 1) + ":");
        for (let j = 0; j < k2-1; j++) {
            if (infoWord[i+j] === undefined) return    
            matrix[i][j][0] = infoWord[i+j];
            console.log(" Column " + (j + 1) + ":");
            for (let k = 0; k < z; k++) {
                console.log("    Dimension " + (k + 1) + ": " + matrix[i][j][k]);
            }
        }
    }

    return matrix;
}

function calculateParityBits(infoWord, matrix) {
    matrix[0][1] = infoWord[0] ^ infoWord[1] ^ infoWord[2] ^ infoWord[3];
    matrix[1][1] = infoWord[4] ^ infoWord[5] ^ infoWord[6] ^ infoWord[7];

    matrix[0][2] = infoWord[0] ^ infoWord[1] ^ infoWord[4] ^ infoWord[5];
    matrix[1][2] = infoWord[2] ^ infoWord[3] ^ infoWord[6] ^ infoWord[7];
}

function generateCodeWord(infoWord, matrix) {
    const codeWord = [...infoWord];
    for (let i = 1; i < matrix[0].length; i++) {
        codeWord.push(matrix[0][i]);
    }
    for (let i = 1; i < matrix[1].length; i++) {
        codeWord.push(matrix[1][i]);
    }
    return codeWord;
}

function generateError(codeWord, errorCount) {
    const erroneousCodeWord = [...codeWord];
    for (let i = 0; i < errorCount; i++) {
        const randomIndex = Math.floor(Math.random() * erroneousCodeWord.length);
        erroneousCodeWord[randomIndex] = 1 - erroneousCodeWord[randomIndex];
    }
    return erroneousCodeWord;
}

function detectAndCorrectErrors(erroneousCodeWord, matrix) {
    const correctedCodeWord = [...erroneousCodeWord];

    const parityBit1 = (erroneousCodeWord[8] ^ erroneousCodeWord[9] ^ erroneousCodeWord[10] ^ erroneousCodeWord[11]) === matrix[0][1];
    const parityBit2 = (erroneousCodeWord[12] ^ erroneousCodeWord[13] ^ erroneousCodeWord[14] ^ erroneousCodeWord[15]) === matrix[1][1];

    if (!parityBit1) {
        correctedCodeWord[8] = 1 - correctedCodeWord[8];
    }
    if (!parityBit2) {
        correctedCodeWord[12] = 1 - correctedCodeWord[12];
    }

    return correctedCodeWord;
}

function analyzeCorrectionCapability(infoWord, correctedCodeWord) {
    const originalInfoWord = infoWord.slice(0, 8);
    const correctedInfoWord = correctedCodeWord.slice(0, 8);

    const isCorrected = originalInfoWord.every((bit, index) => bit === correctedInfoWord[index]);

    if (isCorrected) {
        console.log("Код успешно скорректирован.");
    } else {
        console.log("Ошибка при коррекции кода.");
    }
}

const infoWord = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0];
const k1 = 2, k2 = 4, z = 2;
let matrix = insertInfoWordToMatrix(infoWord, k1, k2, z);

calculateParityBits(infoWord, matrix);

const codeWord = generateCodeWord(infoWord, matrix);

const errorCount = 3;
const erroneousCodeWord = generateError(codeWord, errorCount);
matrix.forEach(row => console.log(row.join(' ')));

const correctedCodeWord = detectAndCorrectErrors(erroneousCodeWord, matrix);

analyzeCorrectionCapability(infoWord, correctedCodeWord);
