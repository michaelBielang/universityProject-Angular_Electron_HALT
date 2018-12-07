/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const {
  app,
  BrowserWindow
} = require('electron');
const fs = require('fs');
const url = require('url');
const {
  fork
} = require('child_process');
const {
  exec
} = require('sudo-prompt');

const path = require('path');
const fs = require('fs');
const logger = require('electron-log');
logger.transports.file.level = 'info';
const loggingPath = path.join(__dirname, 'logging');
if (!fs.existsSync(loggingPath)) {
  fs.mkdirSync(loggingPath);
}
logger.transports.file.file = path.join(loggingPath, 'halt-main.log');


let mainWindow;
let server;

function createWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 600,
      height: 650,
      icon: path.join(__dirname, 'favicon.ico'),
      show: false,
    });

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    mainWindow.on('close', () => {
      // Dereference to garbage collect
      mainWindow = undefined;
    });
  }
}

function createServer() {
  logger.info('starting server child process...');
  if (!server) {
    // see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
    server = fork(path.join(__dirname, 'server.js'));

    server.on('error', err => {
      logger.error('api server: ', err);
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
  cleanUpAndClose().then(() => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }).catch(err => {
    logger.error(err);
  });
});

function cleanUpAndClose() {
  const tmpFileName = 'tmp.key';
  const folderTarget = path.join(__dirname, 'vpn-config-files');

  if (fs.existsSync(folderTarget)) {
    const files = fs.readdirSync(folderTarget);
    files.forEach(file => {
      if (file.indexOf(tmpFileName) !== -1) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          // logger.info(e);
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

function checkIfOpenVpnIsRunning(processName) {
  return new Promise((resolve, reject) => {
    const plat = process.platform;
    const cmd = plat === 'win32' ? 'tasklist' : (plat === 'darwin' ? 'ps -ax | grep ' + mac : (plat === 'linux' ? 'ps -A' : ''));
    const pName = plat === 'win32' ? processName + '.exe' : processName;
    if (cmd === '' || processName === '' || processName == undefined) {
      resolve(false)
    }
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        logger.error(err);
      }
      resolve(stdout.toLowerCase().indexOf(pName.toLowerCase()) > -1)
    });
  });
}
