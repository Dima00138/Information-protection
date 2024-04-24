function main() {
    let Xk: string[] = [];
    Xk.push("Дмитрий");
    Xk.push("Тимошенко");
    Xk.push("сорокадневный");
    Xk.push("111000101111000011100101");

    for (let h = 0; h < Xk.length; h++) {
        console.log("Исходное слово");
        console.log(Xk[h]);
        console.log();

        let W1: string[] = [];
        let k: number;
        console.log("Матрица W1");
        for (let i = 0; i < Xk[h].length; i++) {
            W1.push("");
            for (let j = 0; j < Xk[h].length; j++) {
                k = j + i;
                if (k >= Xk[h].length)
                    k -= Xk[h].length;
                W1[i] += Xk[h][k];
                process.stdout.write(W1[i][j] + " ");
            }
            console.log();
        }
        console.log();

        let W2: string[] = [...W1];
        W2.sort();
        console.log("Матрица W2");
        for (let i = 0; i < Xk[h].length; i++) {
            console.log(W2[i]);
        }
        console.log();

        let Mk = "";
        let z = 0;
        for (let i = 0; i < Xk[h].length; i++) {
            if (W2[i] === Xk[h])
                z = i + 1;
            Mk += W2[i][Xk[h].length - 1];
        }
        console.log(Mk + " " + z);
        console.log();

        for (let i = 0; i < Xk[h].length; i++) {
            W2[i] = "";
        }
        for (let i = 0; i < Xk[h].length; i++) {
            for (let j = 0; j < Xk[h].length; j++) {
                W2[j] = Mk[j] + W2[j];
            }
            W2.sort();
        }
        console.log("Восстановленная матрица W2");
        for (let i = 0; i < Xk[h].length; i++) {
            console.log(W2[i]);
        }
        console.log();

        Xk[h] = W2[z - 1];
        console.log("Восстановленное исходное слово");
        console.log(Xk[h]);
        console.log();
    }
}

main();