const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

fs.mkdir(destinationFolder, { recursive: true }, (err) => {
  if (err && err.code !== 'EEXIST') {
    console.error('Error creating destination folder:', err);
    return;
  }

  copyFolderRecursive(sourceFolder, destinationFolder);
});

function copyFolderRecursive(source, destination) {
  fs.readdir(destination, (err, existingFiles) => {
    if (err) {
      console.error('Error reading destination folder:', err);
      return;
    }

    existingFiles.forEach((existingFile) => {
      const srcFilePath = path.join(source, existingFile);
      const destFilePath = path.join(destination, existingFile);

      if (!fs.existsSync(srcFilePath)) {
        fs.unlink(destFilePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
    });

    fs.readdir(source, (err, files) => {
      if (err) {
        console.error('Error reading source folder:', err);
        return;
      }

      files.forEach((file) => {
        const srcFile = path.join(source, file);
        const destFile = path.join(destination, file);

        fs.stat(srcFile, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          if (stats.isFile()) {
            fs.copyFile(srcFile, destFile, (err) => {
              if (err) {
                console.error('Error copying file:', err);
              }
            });
          } else if (stats.isDirectory()) {
            fs.mkdir(destFile, { recursive: true }, (err) => {
              if (err && err.code !== 'EEXIST') {
                console.error('Error creating destination folder:', err);
                return;
              }

              copyFolderRecursive(srcFile, destFile);
            });
          }
        });
      });
    });
  });
}
