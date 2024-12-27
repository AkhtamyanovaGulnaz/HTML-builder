import { readdir } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newPath = path.join(__dirname, 'files-copy');
const sourcePath = path.join(__dirname, 'files');

fs.rm(newPath, {recursive: true, force: true}, (err) => {
  if (err) {
    return console.error(err);
  }

  fs.mkdir(newPath, {recursive: true}, (err) => {
    if (err) {
      return console.error(err);
    }

    copyDir();
  });
});

function copyDir() {
  readdir(sourcePath, {withFileTypes: true}, (err, files) => {
    if (err) {
      return console.error(err);
    }
  
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = path.basename(file.name);
  
        let from = path.join(sourcePath, fileName);
        let to = path.join(newPath, fileName);
  
        fs.copyFile(from, to, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });  
}
