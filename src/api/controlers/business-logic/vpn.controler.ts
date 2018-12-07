/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../../logging/logger';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'sudo-prompt';

class VPN {
  private vpnTimoutThreshold = 10000; // in ms
  private checkIntervalTime = 250; // in ms
  private sourcePath = __dirname;
  private tmpFileName = 'tmp.key';
  private fileTarget = path.join(this.sourcePath, 'vpn-config-files', this.tmpFileName);

  constructor() { }

  connectHsaVpn(credentials: { id: string, pw: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isInHsaSubnet()) {
        this.createTmpKeyFile(credentials).then(() => {
          exec('openvpn --config \"' + path.join(this.sourcePath, 'vpn-config-files/openvpn-hs-augsburg.ovpn') +
            '\"' + ' --auth-user-pass \"' + this.fileTarget + '\"',
            err => {
              if (err) {
                logger.error(err);
                reject({
                  message: 'openVPN failed to connect: '
                });
              }
            });

          let timeSum = 0;
          const testTimer = setInterval(() => {
            if (timeSum >= this.vpnTimoutThreshold) {
              this.removeTmpKeyFile();
              clearInterval(testTimer);
              logger.error('vpn connection timeout');
              reject({
                message: 'vpn connection timeout'
              });
            }
            if (this.isInHsaSubnet()) {
              this.removeTmpKeyFile();
              clearInterval(testTimer);
              resolve('Connection to HSA VPN established');
            }
            timeSum += this.checkIntervalTime;
          }, this.checkIntervalTime);
        }).catch(err => {
          logger.error(err);
          reject({
            message: 'connectHsaVpn tmp.key creation failed'
          });
        });
      } else {
        resolve('Is already in correct subnet');
      }
    });
  }

  removeTmpKeyFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.fileTarget)) {
        fs.unlinkSync(this.fileTarget);
        resolve();
      }
    });
  }

  createTmpKeyFile(credentials: { id: string, pw: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (credentials.id && credentials.pw) {
        if (fs.existsSync(this.fileTarget)) {
          fs.unlinkSync(this.fileTarget);
        } else {
          const targetFolderPath = path.dirname(this.fileTarget);
          if (!fs.existsSync(targetFolderPath)) fs.mkdirSync(targetFolderPath);
        }
        const tmpFileRef = fs.createWriteStream(this.fileTarget, { flags: 'a' });
        tmpFileRef.write(credentials['id'] + '\n');
        tmpFileRef.write(credentials['pw']);
        resolve();
      } else {
        reject({
          message: 'credentials are invalid'
        });
      }
    });
  }

  isInHsaSubnet() {
    const netInterfaces = os.networkInterfaces();
    for (let ifname of Object.keys(netInterfaces)) {
      for (let iface of netInterfaces[ifname]) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          continue;
        }
        // 141.82. is the eduroam and vpn class B subnet of HSA
        if (iface.address.match(/^141\.82\.\d\.\d/)) {
          return true;
        }
      }
    }
    return false;
  }
}

export default new VPN();
