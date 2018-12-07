/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const {
  app,
  BrowserWindow
} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
// const {
//   exec
// } = require('child_process');
const {
  exec
} = require('sudo-prompt');
const logger = require('electron-log');
logger.transports.file.level = 'info';
const loggingPath = path.join(__dirname, 'logging');
if (!fs.existsSync(loggingPath)) {
  fs.mkdirSync(loggingPath);
}
logger.transports.file.file = path.join(loggingPath, 'halt-dev-main.log');

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
  const tmpFileName = 'tmp.key';
  const fileTarget = path.join(__dirname, '../api/controlers/business-logic/vpn-config-files', tmpFileName);
  if (fs.existsSync(fileTarget)) {
    fs.unlinkSync(fileTarget);
  }

  // TODO doesn't work
  // if (process.platform.indexOf('win') !== -1) {
  //   exec('taskkill /f /t /im openvpn.exe', err => {
  //     if (err) {
  //       logger.error(err);
  //     }
  //   });
  // } else {
  //   exec('pkill \"openvpn\"', err => {
  //     if (err) {
  //       logger.error(err);
  //     }
  //   });
  // }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
