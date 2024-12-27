const fs = require('node:fs');
const path = require('node:path');

const pathName = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathName);

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

readStream.on('end', () => {
  readStream.close();
});
