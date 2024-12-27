import { readdir } from 'node:fs';
import { stat } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathName = path.join(__dirname, 'secret-folder');

readdir(pathName, {withFileTypes: true}, (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    const filePath = path.join(pathName, file.name);

    if (file.isFile()) {
      stat(filePath, (err, stats) => {
        if (err) {
          return console.error(err);
        }

        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExtName = path.extname(file.name).slice(1);

        console.log(`${fileName} - ${fileExtName} - ${stats.size / 1024}kb`);
      });
    }
  });
});