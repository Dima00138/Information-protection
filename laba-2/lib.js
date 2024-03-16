const fs = require('fs');
const path = require('path');

function countFrequency(text) {
    let freqMap = {};
    for (let char of text) {
        if (char in freqMap) {
            freqMap[char]++;
        } else {
            freqMap[char] = 1;
        }
    }
    return freqMap;
}

function calculateEntropy(freqMap, totalChars) {
    let entropy = 0;
    for (let char in freqMap) {
        let p = freqMap[char] / totalChars;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

function calculateHartleyEntropy(alphabetSize) {
    return Math.log2(alphabetSize);
}

function calculateRedundancy(hartleyEntropy, shannonEntropy) {
    return (hartleyEntropy - shannonEntropy)/hartleyEntropy;
}

function processFile(filePath) {
    fs.readFile(filePath, 'utf8', function(err, data) {
        console.log(filePath);
        if (err) throw err;
        let freqMap = countFrequency(data);
        let totalChars = data.length;
        let alphabetSize = Object.keys(freqMap).length;
        let shannonEntropy = calculateEntropy(freqMap, totalChars);
        let hartleyEntropy = calculateHartleyEntropy(alphabetSize);
        let redundancy = calculateRedundancy(hartleyEntropy, shannonEntropy);
        console.log(`Shannon Entropy: ${shannonEntropy}`);
        console.log(`Hartley Entropy: ${hartleyEntropy}`);
        console.log(`Redundancy: ${redundancy}`);
    });
}

let filePath = path.join(__dirname, 'encoded.txt');
processFile(filePath);
filePath = path.join(__dirname, 'sourceFile.docx');
processFile(filePath);


function xor(a, b) {
    let result = '';
    for (let i = 0; i < a.length; i++) {
        result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
    }
    return result;
}

function padWithZeros(a, b) {
    while (a.length < b.length) {
        a += '\0';
    }
    while (b.length < a.length) {
        b += '\0';
    }
    return [a, b];
}

function processInputs(input1, input2, encoding) {
    console.log(encoding);
    let a = Buffer.from(input1, encoding).toString();
    let b = Buffer.from(input2, encoding).toString();
    [a, b] = padWithZeros(a, b);
    let xorResult = xor(a, b);
    console.log(`XOR result: ${xorResult}`);
}

let a = 'Timoshenko';
let b = 'Dmitry';
processInputs(a, b, 'ascii');
a = 'VGltb3NoZW5rbw==';
b = 'RG1pdHJ5';
processInputs(a, b, 'base64');

