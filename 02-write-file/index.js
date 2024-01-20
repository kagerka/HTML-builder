const fs = require('fs');
const path = require('path');
const readline = require('readline');

const createFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const askQuestion = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

askQuestion.question('\nWhat is your name?\n', (data) => {
  if (data === 'exit') {
    byeFn();
    askQuestion.close();
  } else {
    createFile.write(data);
    byeFn();
  }
});

const byeFn = () => {
  askQuestion.on('close', () => {
    console.log('Bye-bye! See you later!\n');
  });
};
