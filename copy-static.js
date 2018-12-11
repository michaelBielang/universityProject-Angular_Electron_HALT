/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const fs = require('fs');
const path = require('path');
const filesToCopy = [{
  source: 'package.json',
  target: 'dist/package.json'
}, {
  source: 'src/api/controlers/business-logic/vpn-config-files/openvpn-hs-augsburg.ovpn',
  target: 'dist/vpn-config-files/openvpn-hs-augsburg.ovpn'
}, {
  source: 'building/Prerequisites/openvpn-install-2.4.6-I602.exe',
  target: 'dist/Prerequisites/openvpn-install-2.4.6-I602.exe'
}, {
  source: 'building/Prerequisites/node-v10.14.1-x64.msi',
  target: 'dist/Prerequisites/node-v10.14.1-x64.msi'
}, {
  source: 'building/Prerequisites/npm-install.bat',
  target: 'dist/Prerequisites/npm-install.bat'
}, {
  source: 'building/Icons/haltv2_icon.ico',
  target: 'dist/Icons/haltv2_icon.ico'
}];

for (let entry of filesToCopy) {
  copyFile(path.join(__dirname, entry['source']), path.join(__dirname, entry['target']));
}

console.info('copied ' + filesToCopy.length + ' files');

function copyFile(src, target) {
  if (fs.existsSync(src)) {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    } else {
      const targetPath = path.dirname(target);
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
    }
    fs.createReadStream(src).pipe(fs.createWriteStream(target));
  }
}
