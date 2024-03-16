const fs = require('fs');
const plotly = require('plotly')('dima00138', 'P5xqEqK40Pyz1qs8nFJa');

let _text = {};

//Символы для гистограммы
function countCharFrequencies(text) {
  const frequencies = {};
  for (let char of text) {
      if (frequencies[char.toLowerCase()]) {
          frequencies[char.toLowerCase()]++;
      } else {
          frequencies[char.toLowerCase()] = 1;
      }
  }
  return frequencies;
}

// Функция для подсчета энтропии алфавита
function calculateEntropy(frequencies) {
  const total = frequencies.reduce((sum, freq) => sum + freq, 0);
  let entropy = 0;

  for (const freq of frequencies) {
    if (freq > 0) {
      const probability = freq / total;
      entropy -= probability * Math.log2(probability);
    }
  }

  return entropy;
}

//Функция для подсчета энтропии в ASCII
function calculateEntropyASCII(entropy, ascii) {
  return entropy * ascii.length;
}

// Функция для чтения текстового файла и подсчета частот символов
function calculateAlphabetEntropy(filename) {
  const text = fs.readFileSync(filename, 'utf8');

  _text = countCharFrequencies(text);

  const frequencies = new Array(65535).fill(0);

    for (const char of text) {
    const code = char.toLowerCase().charCodeAt(0);
    frequencies[code]++;
  }

  return calculateEntropy(frequencies);
}

//Гистограммка
function Gistograms() {
  let data = [
    {
        x: Object.keys(_text),
        y: Object.values(_text),
        type: 'bar'
    }
];

let layout = {
    title: 'Частоты символов',
    xaxis: {
        title: 'Символы'
    },
    yaxis: {
        title: 'Частота'
    }
};

let graphOptions = {layout: layout, filename: 'histogram', fileopt: 'overwrite'};

plotly.plot(data, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
});
}

// Функция для расчета энтропии бинарного источника с ошибками
function calculateErrorEntropy(p) {
  let ret = 0;
  if (1 - p == 0)
    ret = 1 + +[p * Math.log2(p)];
  else
    ret = 1 + +[p * Math.log2(p) + (1 - p) * Math.log2(1 - p)];
  return ret;
}


// Пункт (а)
const latinEntropy = calculateAlphabetEntropy('laba-1/text_latin.txt');
//Gistograms();
const cyrillicEntropy = calculateAlphabetEntropy('laba-1/text_cyrillic.txt');
//Gistograms();

console.log('Энтропия латинского алфавита:', latinEntropy);
console.log('Энтропия кириллического алфавита:', cyrillicEntropy);

// Пункт (б)
const binaryEntropy = calculateAlphabetEntropy('laba-1/text_binary.bin');
console.log('Энтропия бинарного алфавита:', binaryEntropy);

// Пункт (в)
const fullName = 'Timoshenko Dmitry Valerievich';
const nameEntropy = calculateAlphabetEntropy('laba-1/text_cyrillic.txt');
const asciiMessage = fullName.split('').map(char => char.charCodeAt(0)).join('');
console.log(asciiMessage);

const nameInformation = fullName.length * nameEntropy;
const asciiInformation = calculateEntropyASCII(binaryEntropy, asciiMessage);

console.log('Количество информации в сообщении на основе латинского алфавита:', nameInformation);
console.log('Количество информации в сообщении в кодах ASCII:', asciiInformation);

// Пункт (г)
const errorProbabilities = [0.1, 0.5, 1.0];

for (const errorProbability of errorProbabilities) {
  //log2(1) = 0
  console.log(`Количество информации в сообщении с вероятностью ошибки ${errorProbability}:`, asciiMessage.length * calculateErrorEntropy(errorProbability));
}

//чем меньше энтропия, чем чаще можно встретить символ
//колво инфы = энтропия * колво символов (формула 2.3)