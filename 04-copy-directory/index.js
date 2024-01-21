const fs = require('fs');
const path = require('path');

const origFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.access(copyFolderPath, (error) => {
  if (error) {
    copyFiles();
  } else {
    updateFiles();
  }
});

const updateFiles = () => {
  fs.promises
    .rm(copyFolderPath, {
      recursive: true,
    })
    .then(() => {
      copyFiles();
    });
};

const copyFiles = () => {
  fs.promises.mkdir(copyFolderPath).then(() => {
    fs.readdir(origFolderPath, (error, data) => {
      if (error) {
        throw error;
      }
      data.forEach((el) => {
        fs.copyFile(
          path.join(__dirname, 'files', el),
          path.join(__dirname, 'files-copy', el),
          (err) => {
            if (err) {
              throw err;
            }
          },
        );
      });
    });
  });
};
