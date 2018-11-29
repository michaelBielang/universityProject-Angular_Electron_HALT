/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference to prevent garbage collection
let win;

const createWindow = () => {
  // set timeout to render the window not until the Angular
  // compiler is ready to show the project
  setTimeout(() => {
    win = new BrowserWindow({
      width: 1000,
      height: 650,
      icon: './src/favicon.ico',
      webPreferences: {
        nodeIntegration: false // turn it on to use node features
      },
    });

    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
      win = undefined;
    });
  }, 20000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
