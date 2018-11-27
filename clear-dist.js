/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, 'dist');

const deleteFolderRecursive = function(p) {
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
}

deleteFolderRecursive();
