/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const fs = require('fs');
const path = require('path');

copyFile(path.join(__dirname, 'package.json'), path.join(__dirname, 'dist/package.json'));
copyFile(path.join(__dirname, 'src/api/index.html'), path.join(__dirname, 'dist/api/index.html'));

console.info('copied 2 files');

function copyFile(src, target) {
  if (fs.existsSync(src)) {
      fs.createReadStream(src).pipe(fs.createWriteStream(target));
  }
}
