import * as readline from "readline";

async function getUserInput(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question("", (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

function RedBitsCount(k: number): number {
  let r = Math.log(k) / Math.log(2) + 1.99;
  return Math.floor(r);
}

function RandomArr2(mas: number[]): number[] {
  for (let i = 0; i < mas.length; i++) {
    mas[i] = Math.floor(Math.random() * 2);
  }
  return mas;
}

function printMatrix(matrix: number[][], k: number, n: number): void {
  for (let i = 0; i < k; i++) {
    console.log(matrix[i].join(" "));
  }
}

function printTransMatrix(matrix: number[][], k: number, n: number): void {
  for (let j = 0; j < n; j++) {
    let row = "";
    for (let i = 0; i < k; i++) {
      row += matrix[i][j] + " ";
    }
    console.log(row);
  }
}

function checkMatrix(k: number): number[][] {
  let r = RedBitsCount(k);
  let n = r + k;
  let rDouble = r - 1;
  let rPow = Math.pow(2, rDouble);

  let mas = new Array(n).fill(0).map(() => new Array(r).fill(0));

  let combinations = new Array(rPow).fill(0).map(() => new Array(r).fill(0));

  for (let i = 0; i < rPow; i++)
    for (let j = 0; j < r; j++) combinations[i][j] = 0;

  for (let segmentLength = 0; segmentLength < r - 2; segmentLength++) {
    if (segmentLength * r > k) break;

    for (let i = 0; i < segmentLength + 2; i++) {
      combinations[segmentLength * r][i] = 1;
    }

    for (let segmentPosition = 1; segmentPosition < r; segmentPosition++) {
      for (let i = 0; i < r - 1; i++) {
        combinations[segmentLength * r + segmentPosition][i + 1] =
          combinations[segmentLength * r + segmentPosition - 1][i];
      }
      combinations[segmentLength * r + segmentPosition][0] =
        combinations[segmentLength * r + segmentPosition - 1][r - 1];
    }

    if (segmentLength == r - 3) {
      for (let i = 0; i < r; i++) {
        combinations[rPow - 1][i] = 1;
      }
    }
  }

  for (let i = 0; i < k; i++)
    for (let j = 0; j < r; j++) mas[i][j] = combinations[i][j];

  for (let i = 0; i < r; i++) mas[i + k][i] = 1;

  return mas;
}

function addCheckBits(
  masK: number[],
  masN: number[],
  checkMatrix: number[][]
): number[] {
  let lengthK = masK.length; // Should be equal to 2^n
  let lengthN = masN.length;
  let k = Math.sqrt(lengthK);
  let r = RedBitsCount(k);
  let n = k + r;

  let matrix = new Array(k).fill(0).map(() => new Array(n).fill(0));

  for (let i = 0; i < k; i++) {
    let temp = new Array(n).fill(0);
    for (let j = 0; j < k; j++) {
      temp[j] = masK[k * i + j];
    }
    sindrom(checkMatrix, temp, k);

    for (let j = 0; j < n; j++) {
      masN[i * n + j] = temp[j];
    }
  }
  return masN;
}

function interleaving(masN: number[], k: number): number[] {
  let r = RedBitsCount(k);
  let n = k + r;

  let matrix = new Array(k).fill(0).map(() => new Array(n).fill(0));

  for (let i = 0, m = 0; i < k; i++) {
    for (let j = 0; j < n; j++, m++) {
      matrix[i][j] = masN[m];
    }
  }
  console.log("\n\nПолученая матрица");
  printMatrix(matrix, k, n);

  for (let i = 0, m = 0; i < n; i++) {
    for (let j = 0; j < k; j++, m++) {
      masN[m] = matrix[j][i];
    }
  }

  return masN;
}

function reInterleaving(masN: number[], k: number): number[] {
  let r = RedBitsCount(k);
  let n = k + r;

  let matrix = new Array(k).fill(0).map(() => new Array(n).fill(0));

  for (let j = 0, m = 0; j < n; j++) {
    for (let i = 0; i < k; i++, m++) {
      matrix[i][j] = masN[m];
    }
  }
  console.log("\n\nПолученая матрица");
  printMatrix(matrix, k, n);

  for (let j = 0, m = 0; j < k; j++) {
    for (let i = 0; i < n; i++, m++) {
      masN[m] = matrix[j][i];
    }
  }

  return masN;
}

function searchErrorLong(
  masN: number[],
  checkMatrix: number[][],
  k: number
): number[] {
  let r = RedBitsCount(k);
  let n = r + k;

  for (let i = 0; i < k; i++) {
    let temp = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      temp[j] = masN[n * i + j];
    }
    searchError(temp, checkMatrix, k);

    for (let j = 0; j < n; j++) {
      masN[i * n + j] = temp[j];
    }
  }

  return masN;
}

function removeCheckBits(
  masK: number[],
  masN: number[],
  checkMatrix: number[][]
): number[] {
  let lengthK = masK.length; // Should be equal to 2^n
  let lengthN = masN.length;
  let k = Math.sqrt(lengthK);
  let r = RedBitsCount(k);
  let n = k + r;

  let matrix = new Array(k).fill(0).map(() => new Array(n).fill(0));

  for (let i = 0; i < k; i++) {
    let temp = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      temp[j] = masN[n * i + j];
    }

    for (let j = 0; j < k; j++) {
      masK[i * k + j] = temp[j];
    }
  }
  return masK;
}

function sindrom(checkMatrix: number[][], mas: number[], k: number): number[] {
  let r = RedBitsCount(k);
  let n = r + k;
  let sindrom = new Array(r).fill(0);

  for (let i = 0, l = 0; i < r; i++, l = 0) {
    for (let j = 0; j < k; j++) {
      if (checkMatrix[j][i] == 1 && mas[j] == 1) l++;
      else sindrom[i] = 0;
    }
    if (l % 2 == 1) sindrom[i] = 1;
    else sindrom[i] = 0;
  }

  for (let i = 0; i < r; i++) {
    mas[i + k] = sindrom[i];
  }

  return mas;
}

function searchError(
  mas: number[],
  checkMatrix: number[][],
  k: number
): number[] {
  let r = RedBitsCount(k);
  let n = r + k;

  let beforeSindrom = new Array(r).fill(0);
  for (let i = k; i < n; i++) {
    beforeSindrom[i - k] = mas[i];
  }
  mas = sindrom(checkMatrix, mas, k);
  for (let i = k, j = 0; i < n; i++) {
    if (beforeSindrom[i - k] == mas[i]) {
      mas[i] = 0;
      j++;
      if (j == r) {
        for (let l = k; l < n; l++) {
          mas[l] = beforeSindrom[l - k];
        }
        return mas;
      }
    } else {
      mas[i] = 1;
    }
  }
  for (let i = 0; i < n; i++) {
    let l = 0;
    for (let j = 0; j < r; j++) {
      if (checkMatrix[i][j] == mas[j + k]) l++;
    }
    if (l == r) {
      mas[i] = (mas[i] + 1) % 2;
    }
  }
  mas = sindrom(checkMatrix, mas, k);
  return mas;
}

async function main() {
  let lengthK = 16; //2^3<15<=2^4 => 2^4
  let k = Math.sqrt(lengthK);
  let r = RedBitsCount(k);
  let n = k + r;
  let lengthN = lengthK + r * k;

  let masK = new Array(lengthK).fill(0);
  let masK2 = new Array(lengthK).fill(0);
  let masN = new Array(lengthK + r * k).fill(0);
  let checkM = new Array(n).fill(0).map(() => new Array(r).fill(0));
  let error: number;
  let errorLength: number;

  RandomArr2(masK);
  console.log("Входная строка: ");
  console.log(masK.join(" "));

  console.log("\n\nПроверочная матрица: ");
  checkM = checkMatrix(k);
  printTransMatrix(checkM, n, r);
  addCheckBits(masK, masN, checkM);
  console.log("\n\nСтрока с доб. проверочными битами: ");
  console.log(masN.join(" "));

  interleaving(masN, k);
  console.log("\nСтрока после перемежения: ");
  console.log(masN.join(" "));

  console.log("Где ошибка");
  error = parseInt((await getUserInput()) || "0");
  console.log("Длина ошибки");
  errorLength = parseInt((await getUserInput()) || "0");
  for (let i = error; i < error + errorLength; i++) {
    masN[i] = (masN[i] + 1) % 2;
  }
  console.log("\nСтрока с ошибками: ");
  console.log(masN.join(" "));
  reInterleaving(masN, k);
  console.log("\nСтрока после деперемежения: ");
  console.log(masN.join(" "));
  searchErrorLong(masN, checkM, k);
  console.log("\n\nСтрока после исправления ошибок: ");
  console.log(masN.join(" "));
  removeCheckBits(masK2, masN, checkM);
  console.log("\n\nСтрока после удаления проверочных бит: ");
  console.log(masK2.join(" "));
  console.log("");
  console.log("\nИсходная строка: ");
  console.log(masK.join(" "));
}

main();
