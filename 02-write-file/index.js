const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

process.stdin.resume();

const pathName = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathName);

const rl = readline.createInterface({ input, output });

console.log('Please, write something:');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Thanks, bye!');
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('Thanks, bye!');
  rl.close();
});
