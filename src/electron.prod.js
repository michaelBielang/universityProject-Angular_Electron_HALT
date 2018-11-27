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
const {
  exec
} = require('child_process');
const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({ format: winston.format.simple(), level: 'info' }),
    new (winston.transports.File)({ filename: path.join(__dirname, '../logging/electron.log'), level: 'info' }),
  ],
});

let mainWindow;
let server;

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
  // TODO: test child process!
  if (!server) {
    server = exec('node ' + path.join(__dirname, 'server.js'), {
      shell: process.env.indexOf('win') !== -1 ? 'pwsh' : undefined, // use powershell if windows
    }, (error, stdout, stderr) => {
      if (error) {
        logger.error("exec error: ", error);
        return;
      }
      logger.info("stdout: ", stdout);
      logger.info("stderr: ", stderr);
    });
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
