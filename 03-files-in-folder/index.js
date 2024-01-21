const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (error, data) => {
  if (error) {
    throw error;
  } else {
    data.forEach((file) => {
      if (file.isFile()) {
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, el) => {
          if (err) throw err;
          let fileName = file.name.slice(0, file.name.lastIndexOf('.'));
          let fileExtension = path.extname(file.name).slice(1);
          let fileSize = el.size;
          console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
        });
      }
    });
  }
});
