function encodingToBytes(message: string): string {
    let bin: string = '';
    for (let ch of message) {
        bin += ch.charCodeAt(0).toString(2);
    }
    return bin;
}

function encodingFromBytes(binary: number[], r : number): string {
    let binaryString = binary.join('').slice(0, binary.length - r);
    let text = '';
    for (let i = 0; i < binaryString.length; i += 7) {
        let byte = binaryString.slice(i, i + 7);
        let charCode = parseInt(byte, 2);
        text += String.fromCharCode(charCode);
    }
    return text;
}

function hemingLength(k: number): number {
    let r: number = Math.ceil(Math.log2(k));
    return r;
}

function searchError(masXn: number[], masG: number[], checkMatrix: number[][], r: number): void {
    let n = masXn.length;
    let k = n - r;

    let masXnSecond = [...masXn];

    console.log("\nДеление");
    searchResidue(masXnSecond, masG);

    console.log("\nОстаток:");
    printArr(masXnSecond);
    console.log("Синдром: ", masXnSecond.join('').slice(masXnSecond.indexOf(1), masXnSecond.length));

    for (let i = 0; i < n; i++) {
        let coincidence = 0;
        for (let j = 0; j < r; j++) {
            if (checkMatrix[i][j] === masXnSecond[k + j]) {
                coincidence++;
            }
        }
        if (coincidence === r) {
            masXn[i] = (masXn[i] + 1) % 2;
            break;
        }
    }

    console.log("\nИсправленная строка:");
    printArr(masXn);
    console.log(encodingFromBytes(masXn, r));
}

function addLineMatrixMod2(matrix: number[][], str1: number, str2: number, lengthString: number): number[][] {
    for (let i = 0; i < lengthString; i++) {
        matrix[str1][i] = (matrix[str1][i] + matrix[str2][i]) % 2;
    }
    return matrix;
}

function searchResidue(masXn: number[], masXr: number[]): number[] {
    let end = masXn.length - masXr.length + 1;

    for (let i = 0; i < end; i++) {
        if (masXn[i] === 1) {
            addArrMod2(masXn, masXr, i);
            printArr(masXn);
        }
    }
    return masXn;
}

function addArrMod2(mas1: number[], mas2: number[], pos: number): number[] {
    let end = pos + mas2.length;

    for (let i = pos; i < end; i++) {
        mas1[i] = (mas1[i] + mas2[i - pos]) % 2;
    }
    return mas1;
}

function shift(shiftMas: number[], mas: number[]): number[] {
    for (let i = 0; i < mas.length; i++) {
        shiftMas[i] = mas[i];
    }
    return shiftMas;
}

function createGenerationMatrix(mas: number[], k: number, n: number): number[][] {
    let generationMatrix: number[][] = Array(k).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        if (i < mas.length) {
            generationMatrix[0][i] = mas[i];
        } else {
            generationMatrix[0][i] = 0;
        }
    }

    for (let i = 1; i < k; i++) {
        for (let j = 0; j < n - 1; j++) {
            generationMatrix[i][j + 1] = generationMatrix[i - 1][j];
        }
        generationMatrix[i][0] = generationMatrix[i - 1][n - 1];
    }
    return generationMatrix;
}

function createCanonicalMatrix(generationMatrix: number[][], k: number, n: number): number[][] {
    for (let i = 0; i < k; i++) {
        let i2 = i + 1;
        for (let j = i + 1; j < k; j++) {
            if (generationMatrix[i][j] === 1) {
                for (; i2 < k; i2++) {
                    let repeat = false;
                    if (generationMatrix[i2][j] === 1) {
                        for (let j2 = j - 1; j2 > 0; j2--) {
                            if (generationMatrix[i2][j2] === 1) {
                                repeat = true;
                            }
                        }
                        if (repeat) continue;
                        addLineMatrixMod2(generationMatrix, i, i2, n);
                        i2++;
                        break;
                    }
                }
            }
        }
    }
    return generationMatrix;
}

function createCheckMatrix(generationMatrix: number[][], k: number, n: number): number[][] {
    let r = n - k;
    let checkMatrix: number[][] = Array(n).fill(0).map(() => Array(r).fill(0));

    for (let i = 0; i < k; i++) {
        for (let j = 0; j < r; j++) {
            checkMatrix[i][j] = generationMatrix[i][k + j];
        }
    }

    for (let i = k; i < n; i++) {
        for (let j = 0; j < r; j++) {
            if (j === i - k) {
                checkMatrix[i][j] = 1;
            } else {
                checkMatrix[i][j] = 0;
            }
        }
    }
    return checkMatrix;
}

function outMatrix(matrix: number[][], k: number, n: number): void {
    for (let i = 0; i < k; i++) {
        console.log(matrix[i].join(''));
    }
    console.log();
}

function outMatrixProv(matrix: number[][], r: number, n: number): void {
    for (let i = 0; i < n; i++) {
        console.log(matrix[i].join(''));
    }
    console.log();
}

function strInMas(mas: number[], str: string): number[] {
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '1') {
            mas[i] = 1;
        } else {
            mas[i] = 0;
        }
    }
    return mas;
}

function printArr(mas: number[]): void {
    console.log(mas.join(''));
}

const message = 'hillellr';
    let encodingMessage: string = encodingToBytes(message);
    
    let G: string = "1100001";
    let k: number = encodingMessage.length;
    let r: number = hemingLength(k);
    let n: number = k + r;
    
    let masXk: number[] = new Array(k).fill(0);
    strInMas(masXk, encodingMessage);
    let masG: number[] = new Array(G.length).fill(0);
    strInMas(masG, G);
    
    console.log("Входная строка: " + message);
    console.log(`Введенное сообщение в двоичном виде: ${encodingMessage}`);
    console.log("Порождающий полином: " + G);
    console.log(`k = ${k}, r = ${r}, n = ${n}`);
    
    let generationMatrix: number[][] = createGenerationMatrix(masG, k, n);
    console.log("\nПорождающая матрица:");
    outMatrix(generationMatrix, k, n);
    
    console.log();
    console.log("Сложение следующих строк: ");
    createCanonicalMatrix(generationMatrix, k, n);
    console.log("\nКаноническая матрица: ");
    outMatrix(generationMatrix, k, n);
    
    let checkMatrix: number[][] = createCheckMatrix(generationMatrix, k, n);
    console.log("\nПроверочная матрица в канонической форме: ");
    outMatrixProv(checkMatrix, r, n);
    
    let masXn: number[] = new Array(n).fill(0);
    shift(masXn, masXk);
    
    searchResidue(masXn, masG);
    console.log("\nОстаток:");
    const sindrom : number[] = [];
    shift(sindrom, masXn);
    printArr(masXn);
    
    console.log("Кодовое слово:");
    shift(masXn, masXk);
    printArr(masXn);
    console.log(encodingFromBytes(masXn, r));    

    let numberOfErrors: number = Math.round(Math.random() + 1);
    let vector : number[] = new Array(n).fill(0);
    console.log("Колво ошибок: ", numberOfErrors);

    switch (numberOfErrors) {
        case 1:
            let errorPosition: number = Math.round(Math.random()*k);
            console.log("Позиция ошибки: " + errorPosition);
            masXn[errorPosition] = masXn[errorPosition] === 1 ? 0 : 1;
            vector[errorPosition] = 1;
            console.log();
            break;
        case 2:
            let errorPosition1: number = Math.round(Math.random()*k);
            let errorPosition2: number;
            do {
                errorPosition2 = Math.round(Math.random()*k);
            } while (errorPosition1 === errorPosition2);
            console.log(`Позиция первой ошибки: ${errorPosition1}, позиция второй: ${errorPosition2}`);
            masXn[errorPosition1] = masXn[errorPosition1] === 1 ? 0 : 1;
            masXn[errorPosition2] = masXn[errorPosition2] === 1 ? 0 : 1;
            vector[errorPosition1] = 1;
            vector[errorPosition2] = 1;
            console.log();
            break;
        default:
            console.log("Ошибочка");
            console.log();
            break;
    }
    console.log("Ошибочная строка:");
    printArr(masXn);
    console.log("Вектор ошибки: ", vector.join(''));
    console.log("Синдром: ", sindrom.join('').slice(sindrom.indexOf(1), sindrom.length));
    

searchError(masXn, masG, checkMatrix, r);