var path = require('path');
var phantomjs = require('phantomjs-prebuilt');

module.exports = function (sitesFile, destFile, cb) {
    var program = phantomjs.exec(path.join(__dirname, './lib/screenshots.js'), sitesFile, destFile);
    program.stdout.pipe(process.stdout);
    program.stderr.pipe(process.stderr);
    program.on('exit', function(code) {
        if (cb && typeof cb === 'function') {
            cb(code);
        }
    });

};