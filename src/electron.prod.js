const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let serverBackground;

function createWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 600,
      height: 650,
      icon: path.join(__dirname, 'favicon.ico'),
    });

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    mainWindow.on('closed', () => {
      // Dereference to garbage collect
      mainWindow = undefined;
      server = undefined;
    });
  }
}

function createServer() {
  if (!serverBackground) {
    serverBackground = new BrowserWindow({
      show: false,
    });

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'api/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}

app.on('ready', () => {
  createServer();
  createWindow();
});

app.on('activate', () => {
  createServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
