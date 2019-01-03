/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../../logging/logger';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import * as sudo from 'sudo-prompt';

class VPN {
  private vpnTimoutThreshold = 25000; // in ms
  private checkIntervalTime = 250; // in ms
  private sourcePath = path.join(__dirname, 'vpn-config-files');
  private tmpFileName = 'tmp.key';

  /**
   * to check if executing workstation is already in HSA subnet and if not to establish a VPN connection
   * @param credentials: { id, pw }
   * @returns {Promise<any>}
   */
  connectHsaVpn(credentials: { id: string, pw: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isInHsaSubnet()) {
        const rotationFileTarget = moment().year() + '-' + moment().month() + '-' + moment().day() + '_' +
          moment().hour() + '.' + moment().minute() + '.' + moment().second() + '_' + this.tmpFileName;
        this.createTmpKeyFile(credentials, rotationFileTarget).then(rotationFileName => {
          const cmd = 'openvpn --config \"' + path.join(this.sourcePath, 'openvpn-hs-augsburg.ovpn') +
            '\"' + ' --auth-user-pass \"' + path.join(this.sourcePath, rotationFileTarget) + '\"';
          sudo.exec(cmd, {
            name: 'elevatedopenvpn'
          }, err => {
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
              this.removeTmpKeyFile(rotationFileName);
              clearInterval(testTimer);
              // wait for netsh dns flush
              setTimeout(() => {
                resolve('Connection to HSA VPN established');
              }, 7500);
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

  /**
   * since handing over an user and password string directly in command line for OpenVPN isn't possible,
   * a text file needs to be created and removed after connection is established
   * @param rotationFileName
   * @returns {Promise<any>}
   */
  removeTmpKeyFile(rotationFileName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const localTargetPath = path.join(this.sourcePath, (rotationFileName ? rotationFileName : this.tmpFileName));
      if (fs.existsSync(localTargetPath)) {
        try {
          fs.unlinkSync(localTargetPath);
          resolve();
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  /**
   * since handing over an user and password string directly in command line for OpenVPN isn't possible,
   * a text file needs to be created and removed after connection is established
   * @param credentials: { id, pw }
   * @param rotationFileName
   * @returns {Promise<any>}
   */
  createTmpKeyFile(credentials: { id: string, pw: string }, rotationFileName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (credentials.id && credentials.pw) {
        const localTargetPath = path.join(this.sourcePath, (rotationFileName ? rotationFileName : this.tmpFileName));
        if (fs.existsSync(localTargetPath)) {
          fs.unlinkSync(localTargetPath);
        } else {
          const targetFolderPath = path.dirname(localTargetPath);
          if (!fs.existsSync(targetFolderPath)) {
            fs.mkdirSync(targetFolderPath);
          }
        }
        const tmpFileRef = fs.createWriteStream(localTargetPath, { flags: 'a' });
        tmpFileRef.write(credentials['id'] + '\n');
        tmpFileRef.write(credentials['pw']);
        resolve(rotationFileName);
      } else {
        reject({
          message: 'credentials are invalid'
        });
      }
    });
  }

  /**
   * to check if workstation is already in correct subnet and if a new VPN connection is required
   * @returns boolean
   */
  isInHsaSubnet() {
    const netInterfaces = os.networkInterfaces();
    for (const ifname of Object.keys(netInterfaces)) {
      for (const iface of netInterfaces[ifname]) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          continue;
        }
        // 141.82. is the eduroam and vpn class B subnet of HSA
        if (iface.address.match(/^141\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
          logger.info('is in HSA subnet!');
          return true;
        }
      }
    }
    return false;
  }
}

export default new VPN();
