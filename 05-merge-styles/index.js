const fs = require('node:fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

let styles = [];

fs.readdir(stylesPath, { withFileTypes: true }).then((data) => {
  data.forEach((file) => {
    if (file.isFile()) {
      if (path.extname(file.name) === '.css') {
        fs.readFile(path.join(__dirname, 'styles', file.name))
          .then((css) => {
            styles.push(css.toString());
            styles.push('\n');
          })
          .then(() => {
            fs.writeFile(bundlePath, styles.join(''));
          });
      }
    }
  });
});
