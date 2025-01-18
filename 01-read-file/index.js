const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath);

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
readStream.on('end', () => {
  console.log('File reading complete.');
});
readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});
