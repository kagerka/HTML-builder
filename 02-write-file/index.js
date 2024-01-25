const fs = require('fs');
const path = require('path');
const readline = require('readline');

const createFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const askQuestion = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

askQuestion.prompt();
console.log('What is your name?');

askQuestion.on('line', (data) => {
  if (data === 'exit') {
    askQuestion.close();
  } else {
    createFile.write(data + '\n');
  }
});

const byeFn = () => {
  askQuestion.on('close', () => {
    console.log('Bye-bye! See you later!');
  });
};

byeFn();
