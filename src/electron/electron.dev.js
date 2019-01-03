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
const sudo = require('sudo-prompt').exec;
const exec = require('child_process').exec;
const logger = require('electron-log');
logger.transports.file.level = 'info';
const loggingPath = path.join(__dirname, 'logging');
if (!fs.existsSync(loggingPath)) {
  fs.mkdirSync(loggingPath);
}
logger.transports.file.file = path.join(loggingPath, 'halt-dev-main.log');

// Keep a global reference to prevent garbage collection
let win;

/**
 * To open visible Window for users to interact with
 */
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
  cleanUpAndClose().then(() => {
    // IOS should not close, since process management is handled differently
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }).catch(err => {
    logger.error(err);
  });
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

/**
 * Close possible existing OpenVPN connections
 * @returns {Promise<any>}
 */
function cleanUpAndClose() {
  const tmpFileName = 'tmp.key';
  const folderTarget = path.join(__dirname, '../api/controlers/business-logic/vpn-config-files');

  if (fs.existsSync(folderTarget)) {
    const files = fs.readdirSync(folderTarget);
    files.forEach(file => {
      if (file.indexOf(tmpFileName) !== -1) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          logger.debug(e);
        }
      }
    });
  }

  return new Promise((resolve, reject) => {
    checkIfOpenVpnIsRunning('openvpn').then(isRunning => {
      if (isRunning) {
        if (process.platform.indexOf('win') !== -1) {
          sudo('taskkill /im openvpn.exe /f /t', {
            name: 'openvpnkill'
          }, err => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        } else {
          sudo('pkill \"openvpn\"', {
            name: 'openvpnkill'
          }, err => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        }
      }
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * Determine according to OS, if given process is listed in process list and therefore active
 * @param processName
 * @returns {Promise<any>}
 */
function checkIfOpenVpnIsRunning(processName) {
  return new Promise((resolve, reject) => {
    const plat = process.platform;
    const cmd = plat === 'win32' ? 'tasklist' : (plat === 'darwin' ? 'ps -ax | grep ' + mac : (plat === 'linux' ? 'ps -A' : ''));
    const pName = plat === 'win32' ? processName + '.exe' : processName;
    // processName == undefined also tests if processName == null
    if (cmd === '' || processName === '' || processName == undefined) {
      resolve(false);
    }
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        logger.error(err);
      }
      resolve(stdout.toLowerCase().indexOf(pName.toLowerCase()) > -1)
    });
  });
}
