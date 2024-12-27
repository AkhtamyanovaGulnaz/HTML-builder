import { readdir } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathName = path.join(__dirname, 'styles');
const bundlePathName = path.join(__dirname, 'project-dist', 'bundle.css');

fs.createWriteStream(bundlePathName);

readdir(pathName, {withFileTypes: true}, (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      if (err) {
        return console.error(err);
      }

      const fileName = path.join(pathName, file.name);

      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          return console.error(err);
        }

        fs.appendFile(bundlePathName, data, err => {
          if (err) {
            return console.error(err);
          }
        });
      });
    }
  });
});