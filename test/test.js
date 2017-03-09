var path = require('path');
var screenshots = require('../index.js');
screenshots(path.join(__dirname, './sites.json'), path.join(__dirname, './photos'), function (code) {
    console.log('the code is ' + code);
});
