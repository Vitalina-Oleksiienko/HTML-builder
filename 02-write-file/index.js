const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.join(__dirname, 'output.txt');

fs.open(filePath, 'a', (err, fd) => {
  if (err) {
    console.error('Error opening file:', err);
    process.exit(1);
  }

  const writableStream = fs.createWriteStream(null, { fd });

  console.log('Enter text to write to the file (or "exit" to quit):');

  readline.on('line', (input) => {
    if (input.trim() === 'exit') {
      console.log('Goodbye!');
      writableStream.end();
      process.exit();
    } else {
      writableStream.write(`${input}\n`);
      console.log('Enter more text (or "exit" to quit):');
    }
  });

  process.on('SIGINT', () => {
    console.log('Goodbye!');
    writableStream.end();
    process.exit();
  });
});
