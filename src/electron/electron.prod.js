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
  spawn,
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

// keeping a reference in global so that OS isn't garbage collecting it
let mainWindow;
let server;

/**
 * To open visible Window for users to interact with
 */
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

/**
 * Starting child process for the Express API backend
 */
function createServer() {
  logger.info('starting server child process...');

  if (!server) {
    server = spawn('node', [path.join(appDir, 'server/server.js')]);

    server.on('error', err => {
      logger.error('api server: ', err);
    });

    server.stdout.on('data', data => {
      logger.info('api server stdout: ', data.toString('utf8'));
    });

    server.stderr.on('data', data => {
      logger.error('api server stderr: ', data.toString('utf8'));
    });

    server.on('close', code => {
      if (code !== 0) {
        logger.error('api server exited with code: ', code);
      }
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
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

/**
 * Close possible existing OpenVPN connections and open child processes
 */
async function cleanUpAndClose() {
  const tmpFileName = 'tmp.key';
  const folderTarget = path.join(appDir, 'vpn-config-files');

  if (fs.existsSync(folderTarget)) {
    const files = fs.readdirSync(folderTarget);
    files.forEach(file => {
      if (file.indexOf(tmpFileName) !== -1) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          logger.error(e);
        }
      }
    });
  }

  await new Promise((resolve, reject) => {
    checkIfOpenVpnIsRunning('openvpn').then(isRunning => {
      if (isRunning) {
        killProcesses('openvpn').then(msg => {
          resolve(msg);
        }).catch(err => {
          reject(err);
        });
      } else {
        resolve();
      }
    }).catch(err => {
      reject(err);
    });
  });

  await new Promise((resolve, reject) => {
    checkIfOpenVpnIsRunning('HALT').then(isRunning => {
      if (isRunning) {
        killProcesses('HALT').then(msg => {
          resolve(msg);
        }).catch(err => {
          reject(err);
        });
      } else {
        resolve();
      }
    }).catch(err => {
      reject(err);
    });
  });

  return;
}

/**
 * Actually killing given process with name
 * @param processName
 * @returns {Promise<any>}
 */
function killProcesses(processName) {
  return new Promise((resolve, reject) => {
    const killMsg = 'killed all ' + processName + ' processes';
    const killProcessName = 'haltcleanupkill';
    let cmd = 'pkill \"' + processName + '\"';
    if (process.platform.indexOf('win') !== -1) {
      cmd = 'taskkill /im ' + processName + '.exe /f /t';
    }
    exec(cmd, {
      name: killProcessName
    }, err => {
      if (err) {
        logger.error('Elevating child process rights due to error...');
        sudo(cmd, {
          name: killProcessName
        }, err => {
          if (err) {
            reject(err);
          } else {
            resolve(killMsg);
          }
        });
      } else {
        resolve(killMsg);
      }
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
