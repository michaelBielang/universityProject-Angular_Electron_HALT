/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const fs = require('fs');
const path = require('path');
const filesToCopy = [
  {
    source: 'package.json',
    target: 'dist/package.json'
  },{
      source: 'src/api/controlers/business-logic/vpn-config-files/openvpn-hs-augsburg.ovpn',
      target: 'vpn-config-files/openvpn-hs-augsburg.ovpn'
  },
];

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
