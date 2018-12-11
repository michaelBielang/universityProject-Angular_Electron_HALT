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
  fork,
  exec
} = require('child_process');
const sudo = require('sudo-prompt').exec;
const path = require('path');
const logger = require('electron-log');
logger.transports.file.level = 'info';
const appDir = __dirname;
const loggingPath = path.join(appDir, 'logging');
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
      icon: path.join(appDir, 'favicon.ico'),
      show: false,
    });

    mainWindow.loadURL(url.format({
      pathname: path.join(appDir, 'index.html'),
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


  // TODO
  logger.error('Test Error!');


  if (!server) {
    // see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
    // https://stackoverflow.com/questions/33478696/how-to-pass-messages-as-well-as-stdout-from-child-to-parent-in-node-js-child-pro
    server = fork(path.join(appDir, 'server.js'), [], { silent: true });

    server.on('error', err => {
      logger.error('api server: ', err);
    });

    server.on('message', data => {
      logger.error('api server message: ', data.toString('utf8'));
    });

    server.stdout.on('data', data => {
      logger.error('api server stdout: ', data.toString('utf8'));
    });

    server.stderr.on('data', data => {
      logger.error('api server stderr: ', data.toString('utf8'));
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
  const folderTarget = path.join(appDir, 'vpn-config-files');

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
