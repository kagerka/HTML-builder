const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const newAssetsPath = path.join(__dirname, 'project-dist', 'assets');
const origAssetsPath = path.join(__dirname, 'assets');

let styles = [];

fs.access(projectPath, (error) => {
  if (error) {
    copyFolder();
  } else {
    removeFolder();
  }
});

const removeFolder = () => {
  fs.promises.rm(projectPath, { recursive: true, force: true }).then(() => {
    copyFolder();
  });
};

const copyFolder = () => {
  fs.promises
    .mkdir(projectPath)
    .then(() => {
      fs.readFile(
        path.join(__dirname, 'template.html'),
        'utf-8',
        (err, data) => {
          fs.promises
            .writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              data,
              'utf8',
            )
            .then(() => {
              const readStream = fs.createReadStream(
                path.join(__dirname, 'project-dist', 'index.html'),
                'utf-8',
              );

              readStream.on('data', (i) => {
                let content = i.toString();

                fs.readdir(path.join(__dirname, 'components'), (err, files) => {
                  files.forEach((el) => {
                    const component = fs.createReadStream(
                      path.join(__dirname, 'components', el),
                      'utf-8',
                    );
                    component.on('data', (j) => {
                      content = content.replace(
                        `{{${el.slice(0, el.lastIndexOf('.'))}}}`,
                        j.toString(),
                      );
                      fs.createWriteStream(
                        path.join(__dirname, 'project-dist', 'index.html'),
                      ).write(content);
                    });
                  });
                });
              });
            });
        },
      );

      fs.promises
        .writeFile(path.join(__dirname, 'project-dist', 'style.css'), '')
        .then(() => {
          fs.promises
            .readdir(path.join(__dirname, 'styles'), {
              withFileTypes: true,
            })
            .then((data) => {
              data.forEach((file) => {
                if (file.isFile()) {
                  if (path.extname(file.name) === '.css') {
                    fs.promises
                      .readFile(path.join(__dirname, 'styles', file.name))
                      .then((css) => {
                        styles.push(css.toString());
                        styles.push('\n');
                      })
                      .then(() => {
                        fs.promises.writeFile(
                          path.join(__dirname, 'project-dist', 'style.css'),
                          styles.join(''),
                        );
                      });
                  }
                }
              });
            });
        });
    })
    .then(() => {
      fs.promises.mkdir(newAssetsPath).then(() => {
        fs.promises.readdir(origAssetsPath).then((data) => {
          data.forEach((folder) => {
            fs.promises
              .mkdir(path.join(__dirname, 'project-dist', 'assets', folder))
              .then(() => {
                fs.readdir(
                  path.join(__dirname, 'assets', folder),
                  (err, fl) => {
                    fl.forEach((el) => {
                      fs.copyFile(
                        path.join(__dirname, 'assets', folder, el),
                        path.join(
                          __dirname,
                          'project-dist',
                          'assets',
                          folder,
                          el,
                        ),
                        (err) => {
                          if (err) {
                            throw err;
                          }
                        },
                      );
                    });
                  },
                );
              });
          });
        });
      });
    });
};
