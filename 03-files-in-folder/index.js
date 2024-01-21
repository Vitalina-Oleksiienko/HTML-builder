const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      if (stats.isFile()) {
        const [name, ext] = file.split('.');
        const size = stats.size;
        console.log(`${name} - ${ext} - ${size}b`);
      }
    });
  });
});
