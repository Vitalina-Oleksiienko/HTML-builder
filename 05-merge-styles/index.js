const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

fs.mkdir(distFolderPath, { recursive: true }, (err) => {
  if (err) {
    console.error(`Error creating project-dist folder: ${err.message}`);
    return;
  }

  fs.readdir(stylesFolderPath, (err, files) => {
    if (err) {
      console.error(`Error reading styles folder: ${err.message}`);
      return;
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesArray = [];

    cssFiles.forEach((file) => {
      const filePath = path.join(stylesFolderPath, file);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error reading file content: ${err.message}`);
          return;
        }

        stylesArray.push(data);

        if (stylesArray.length === cssFiles.length) {
          const bundleContent = stylesArray.join('\n');
          fs.writeFile(bundleFilePath, bundleContent, 'utf-8', (err) => {
            if (err) {
              console.error(`Error writing to bundle.css: ${err.message}`);
              return;
            }
            console.log('Bundle.css file has been created successfully.');
          });
        }
      });
    });
  });
});
