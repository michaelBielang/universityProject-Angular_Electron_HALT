/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, 'dist');
let breakCounter = 0;

const deleteFolderRecursive = function(p) {
  try {
    if (fs.existsSync(p)) {
      fs.readdirSync(p).forEach(function(file, index){
        var curPath = p + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(p);
    }
  } catch (e) {
    console.error(e.message);
    console.error('retry attempt: ' + breakCounter);
    if (++breakCounter < 5) deleteFolderRecursive(p);
  }
}

deleteFolderRecursive(distPath);

setTimeout(() => {
  console.info('cleared dist folder...')
}, 50);
