
function insertInfoWordToMatrix(infoWord, k1, k2, z) {
    const rows = Math.ceil(infoWord.length / k1);
    const columns = k2 + 1;

    const matrix = Array(rows).fill().map(() => Array(columns).fill().map(() => Array(z+1).fill(0)));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (i * k1 + j < infoWord.length) {
                matrix[i][j][0] = infoWord[i * k1 + j];
            }
        }
    }

    return matrix;
}

function calculateParityBits(matrix) {
    const rows = matrix.length;
    const columns = matrix[0].length;
    const z = matrix[0][0].length;

    const horizontalParity = Array(rows).fill(0);
    const verticalParity = Array(columns).fill(0);
    const diagonalParityTopLeftToBottomRight = Array(Math.min(rows, columns)).fill(0);
    const diagonalParityBottomLeftToTopRight = Array(Math.min(rows, columns)).fill(0);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            for (let k = 0; k < z; k++) {
                horizontalParity[i] ^= matrix[i][j][k];
            }
        }
    }

    for (let j = 0; j < columns; j++) {
        for (let i = 0; i < rows; i++) {
            for (let k = 0; k < z; k++) {
                verticalParity[j] ^= matrix[i][j][k];
            }
        }
    }

    for (let i = 0; i < Math.min(rows, columns); i++) {
        for (let k = 0; k < z; k++) {
            diagonalParityTopLeftToBottomRight[i] ^= matrix[i][i][k];
        }
    }

    for (let i = 0; i < Math.min(rows, columns); i++) {
        for (let k = 0; k < z; k++) {
            diagonalParityBottomLeftToTopRight[i] ^= matrix[rows - 1 - i][i][k];
        }
    }

    return {
        horizontalParity,
        verticalParity,
        diagonalParityTopLeftToBottomRight,
        diagonalParityBottomLeftToTopRight
    };
}

function generateCodeWord(infoWord) {
    const codeWord = [...infoWord];
    parityBits.horizontalParity.forEach((el) => {
        codeWord.push(el);
    })
    parityBits.verticalParity.forEach((el) => {
        codeWord.push(el);
    })
    parityBits.diagonalParityTopLeftToBottomRight.forEach((el) => {
        codeWord.push(el);
    })
    parityBits.diagonalParityBottomLeftToTopRight.forEach((el) => {
        codeWord.push(el);
    })
    return codeWord;
}

function generateError(codeWord, errorCount) {
    const erroneousCodeWord = [...codeWord];

    errorCount = Math.min(errorCount, erroneousCodeWord.length);

    for (let i = 0; i < errorCount; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * erroneousCodeWord.length);
        } while (erroneousCodeWord[randomIndex] === undefined);

        erroneousCodeWord[randomIndex] = 1 - erroneousCodeWord[randomIndex];
    }

    return erroneousCodeWord;
}

function correctErrors(Y_n, parityBits) {
    const correctedCodeWord = [...Y_n];

    const parityPositions = {
        diagonalParityBottomLeftToTopRight: Y_n.length - parityBits.diagonalParityBottomLeftToTopRight.length,
        diagonalParityTopLeftToBottomRight: Y_n.length - parityBits.diagonalParityBottomLeftToTopRight.length - parityBits.diagonalParityTopLeftToBottomRight.length,
        verticalParity: Y_n.length - parityBits.diagonalParityBottomLeftToTopRight.length - parityBits.diagonalParityTopLeftToBottomRight.length - parityBits.verticalParity.length,
        horizontalParity: Y_n.length - parityBits.diagonalParityBottomLeftToTopRight.length - parityBits.diagonalParityTopLeftToBottomRight.length - parityBits.verticalParity.length - parityBits.horizontalParity.length
    };


    
    Object.keys(parityBits).forEach(parityType => {
        const expectedParityBits = parityBits[parityType];
        const receivedParityBits = correctedCodeWord.slice(parityPositions[parityType], parityPositions[parityType] + expectedParityBits.length);
        console.log(`Expected parity bits ${parityType}, ${parityPositions[parityType] + expectedParityBits.length}`, expectedParityBits);
        console.log("Received parity bits", receivedParityBits);

        expectedParityBits.forEach((expectedBit, index) => {
            if (expectedBit !== receivedParityBits[index]) {
                correctedCodeWord[parityPositions[parityType] + index] = expectedBit;
            }
        });
    });
    
    return correctedCodeWord;
}

function analyzeCorrectionCapability(X_n, Errors, generateError, correctErrors, N1) {
    let N2 = 0; // Все найдены
    let N3 = 0; // Все исправлены

    for (let i = 0; i < N1; i++) {
        const erroneousCodeWord = generateError(X_n, Errors);
        //console.log(X_n, erroneousCodeWord);
        const correctedCodeWord = correctErrors(erroneousCodeWord, parityBits);
        //console.log(erroneousCodeWord);
        //console.log(correctedCodeWord);

        if (countErrors(erroneousCodeWord, X_n) === Errors) {
            N2++;
            if (countErrors(correctedCodeWord, X_n) === 0) {
                N3++;
            }
        }
    }

    const ratioN2N1 = N2 / N1;
    const ratioN3N1 = N3 / N1;

    return { ratioN2N1, ratioN3N1 };
}

function countErrors(word1, word2) {
    let errorCount = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) {
            errorCount++;
        }
    }
    return errorCount;
}

const infoWord = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0];
const k1 = 2, k2 = 4, z = 2;
const dMin = k1 + k2 + z + 1;
const N1 = 5;
let matrix = insertInfoWordToMatrix(infoWord, k1, k2, z);

const parityBits = calculateParityBits(matrix);
console.log(`parity bits`, parityBits);

const codeWord = generateCodeWord(infoWord);

const errorCount = 3;
//const erroneousCodeWord = generateError(codeWord, errorCount);
//matrix.forEach(row => console.log(row.join(' ')));

//const correctedCodeWord = correctErrors(erroneousCodeWord, parityBits);

console.log(analyzeCorrectionCapability(codeWord, errorCount, generateError, correctErrors, N1));
