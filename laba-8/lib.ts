class TNode {
    symbol: string;
    frequency: number;
    right: TNode | null;
    left: TNode | null;

    constructor(symbol: string, frequency: number) {
        this.symbol = symbol;
        this.frequency = frequency;
        this.right = null;
        this.left = null;
    }

    traverse(symbol: string, data: boolean[]): boolean[] | null {
        if (this.right === null && this.left === null) {
            return symbol === this.symbol ? data : null;
        }

        let left: boolean[] | null = null;
        let right: boolean[] | null = null;

        if (this.left !== null) {
            left = this.left.traverse(symbol, [...data, false]);
        }

        if (this.right !== null) {
            right = this.right.traverse(symbol, [...data, true]);
        }

        return left !== null ? left : right;
    }
}

class HuffmanTree {
    nodes: TNode[] = [];
    root: TNode | null = null;
    frequencies: Map<string, number> = new Map<string, number>();

    build(source: string): void {
        for (const char of source) {
            this.frequencies.set(char, (this.frequencies.get(char) || 0) + 1);
        }

        this.nodes = Array.from(this.frequencies.entries()).map(([symbol, frequency]) => new TNode(symbol, frequency));

        while (this.nodes.length > 1) {
            this.nodes.sort((a, b) => a.frequency - b.frequency);

            const left = this.nodes.shift() as TNode;
            const right = this.nodes.shift() as TNode;
            const parent = new TNode('*', left.frequency + right.frequency);
            parent.left = left;
            parent.right = right;

            this.nodes.push(parent);
            this.root = parent;
        }
    }

    encode(source: string): number[] {
        const encodedSource: boolean[] = [];

        for (const char of source) {
            const encodedSymbol = this.root?.traverse(char, []);
            if (encodedSymbol) {
                encodedSource.push(...encodedSymbol);
            }
        }

        return encodedSource.map(bit => bit ? 1 : 0);
    }

    decode(bits: number[]): string {
        let current = this.root;
        let decoded = "";

        for (const bit of bits) {
            current = bit ? current?.right ?? null : current?.left ?? null;

            if (current && this.isLeaf(current)) {
                decoded += current.symbol;
                current = this.root;
            }
        }

        return decoded;
    }

    isLeaf(node: TNode): boolean {
        return node.left === null && node.right === null;
    }
}

function calculateFrequencyAndProbabilityForEachLetter(message: string) {
    const frequencyMap = new Map<string, { frequency: number; probability: number }>();

    for (const letter of message) {
        const entry = frequencyMap.get(letter) || { frequency: 0, probability: 0 };
        entry.frequency++;
        entry.probability = entry.frequency / message.length;
        frequencyMap.set(letter, entry);
    }

    const letters = Array.from(frequencyMap.keys());
    const frequencies = letters.map(letter => frequencyMap.get(letter)!.frequency);
    const probabilities = letters.map(letter => frequencyMap.get(letter)!.probability);

    return { letters, frequencies, probabilities };
}

function fillArrsFromLists(letters: string[], frequencies: number[], probabilities: number[]) {
    return { sortedLetters: letters, sortedProbabilities: probabilities };
}

function sortArrOfLettersAndProbabilities(sortedLetters: string[], sortedProbabilities: number[]) {
    const combined = sortedLetters.map((letter, index) => ({ letter, probability: sortedProbabilities[index] }));
    combined.sort((a, b) => b.probability - a.probability);
    return { sortedLetters: combined.map(item => item.letter), sortedProbabilities: combined.map(item => item.probability) };
}

function shannonFano(sortedLetters: string[], sortedProbabilities: number[]): string[] {
    const letterBits: string[] = Array(sortedLetters.length).fill('');
    shannonFanoRecursive(0, sortedLetters.length - 1, sortedProbabilities, letterBits, '');
    return letterBits;
}

function shannonFanoRecursive(left: number, right: number, sortedProbabilities: number[], letterBits: string[], prefix: string) {
    if (left >= right) {
        return;
    }

    const totalProbability = sortedProbabilities.slice(left, right + 1).reduce((a, b) => a + b, 0);
    let sum = 0;
    let m = left;
    while (sum < totalProbability / 2) {
        sum += sortedProbabilities[m];
        m++;
    }

    for (let i = left; i <= right; i++) {
        letterBits[i] = i < m ? prefix + '0' : prefix + '1';
    }

    shannonFanoRecursive(left, m - 1, sortedProbabilities, letterBits, prefix + '0');
    shannonFanoRecursive(m, right, sortedProbabilities, letterBits, prefix + '1');
}

function encodeMessage(message: string, sortedLetters: string[], letterBits: string[]): string {
    const encodedMessage: string[] = [];
    for (const letter of message) {
        const letterIndex = sortedLetters.indexOf(letter);
        if (letterIndex !== -1) {
            encodedMessage.push(letterBits[letterIndex]);
        }
    }
    return encodedMessage.join('');
}

function decodeMessage(encodedMessage: string, sortedLetters: string[], letterBits: string[]): string {
    let decodedMessage = '';
    let temp = '';
    for (const bit of encodedMessage) {
        temp += bit;
        const bitIndex = letterBits.indexOf(temp);
        if (bitIndex !== -1) {
            decodedMessage += sortedLetters[bitIndex];
            temp = '';
        }
    }
    return decodedMessage;
}

function encodingToBytes(message: string): string {
    let bin = '';
    for (const char of message) {
        const charCode = char.charCodeAt(0);
        const binary = charCode.toString(2).padStart(8, '0');
        bin += binary;
    }
    return bin;
}


const message = "Timoshenko Dmitry".toLowerCase();
const { letters, frequencies, probabilities } = calculateFrequencyAndProbabilityForEachLetter(message);
const { sortedLetters, sortedProbabilities } = fillArrsFromLists(letters, frequencies, probabilities);
sortArrOfLettersAndProbabilities(sortedLetters, sortedProbabilities);

console.log("Letter Probabilities:");
for (let i = 0; i < sortedLetters.length; i++) {
    console.log(` ${sortedLetters[i]}: ${sortedProbabilities[i]}`);
}

console.log("\nShannon-Fano method");
const letterBits = shannonFano(sortedLetters, sortedProbabilities);
console.log("Letter   Bits");
for (let i = 0; i < letterBits.length; i++) {
    console.log(` ${sortedLetters[i]}      ${letterBits[i]}`);
}

const encodedMessage = encodeMessage(message, sortedLetters, letterBits);
console.log(`\nEncoded message: ${encodedMessage}\n`);

const decodedMessage = decodeMessage(encodedMessage, sortedLetters, letterBits);
console.log(`Decoded message: ${decodedMessage}`);

console.log("\n\nHuffman method");
const huffmanTree = new HuffmanTree();
huffmanTree.build(message);
const encoded = huffmanTree.encode(message);
console.log("Encoded message:", encoded.join(''));
const decoded = huffmanTree.decode(encoded);
console.log("\nDecoded message:", decoded);

console.log("\n\nASCII");
const asciiEncoded = encodingToBytes(message);
console.log(`ASCII encoding: ${asciiEncoded}`);

console.log("\n\nRESULT");
console.log(`Shannon-Fano length: ${encodedMessage.length}`);
console.log(`Huffman length: ${encoded.length}`);
console.log(`ASCII length: ${asciiEncoded.length}`);
