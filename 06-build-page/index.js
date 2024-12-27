import { readdir } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDist = path.join(__dirname, 'project-dist');
const newAssetsPath = path.join(__dirname, 'project-dist',  'assets');
const sourceAssetsPath = path.join(__dirname, 'assets');
const pathStylesNames = path.join(__dirname, 'styles');
const newStyleFile = path.join(__dirname, 'project-dist', 'style.css');
const sourceHTMLFile = path.join(__dirname, 'template.html');
const newHTMLFile = path.join(__dirname, 'project-dist', 'index.html');
const components = path.join(__dirname, 'components');

fs.rm(projectDist, {recursive: true, force: true}, (err) => {
  if (err) {
    return console.error(err);
  }

  fs.mkdir(projectDist, {recursive: true}, (err) => {
    if (err) {
      return console.error(err);
    }

    readTemplate();
    bundleCSS();
    copyAssets();
  });
});

function readTemplate() {
  fs.createWriteStream(newHTMLFile);

  fs.readFile(sourceHTMLFile, 'utf8', (err, data) => {
    if (err) {
      return console.error(err);
    }
  
    let htmlContent = data.trim();
    let componentsProcessed = 0;
  
    fs.readdir(components, (err, files) => {
      if (err) {
        return console.error(err);
      }

      const totalComponents = files.filter(file => path.extname(file) === '.html').length;

      if (totalComponents === 0) {
        fs.writeFile(newHTMLFile, htmlContent, (err) => {
          if (err) {
            return console.error(err);
          }
        });
        return;
      }
  
      files.forEach(file => {
        if (path.extname(file) === '.html') {
          const componentName = `{{${path.basename(file, '.html')}}}`;
          const componentPath = path.join(components, file);
  
          fs.readFile(componentPath, 'utf8', (err, componentData) => {
            if (err) {
              return console.error(err);
            }
  
            htmlContent = htmlContent.replace(new RegExp(componentName, 'g'), componentData);
            componentsProcessed++;

            if (componentsProcessed === totalComponents) {
              fs.writeFile(newHTMLFile, htmlContent, (err) => {
                if (err) {
                  return console.error(err);
                }
              });
            }
          });
        }
      });
    });
  });
}

function bundleCSS() {
  fs.createWriteStream(newStyleFile);

  readdir(pathStylesNames, {withFileTypes: true}, (err, files) => {
    if (err) {
      return console.error(err);
    }
  
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        if (err) {
          return console.error(err);
        }
  
        const fileName = path.join(pathStylesNames, file.name);
  
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            return console.error(err);
          }
  
          fs.appendFile(newStyleFile, data, err => {
            if (err) {
              return console.error(err);
            }
          });
        });
      }
    });
  });
}

function copyAssets(src = sourceAssetsPath, dest = newAssetsPath) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }

    readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error(err);
      }

      files.forEach((file) => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        if (file.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    });
  });
}