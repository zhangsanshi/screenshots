var page = require('webpage').create();
var fs = require('fs');
var system = require('system');

// 获取时间
var now = new Date();
var year = now.getFullYear();
var day = now.getDate();
var month = now.getMonth() + 1;
var datePath = year + '/' + month + '/' + day;

// 加载页面失败收集
var LoadError = {

};

// 获取当前文件目录
function getPath() {
    return system.args[2];
}
var destname = getPath();

// 站点 JSON
var sites = {};

page.onResourceRequested = function (requestData, networkRequest) {

};
page.onResourceReceived = function (response) {

};
page.onResourceTimeout = function (request) {

};
page.onResourceError = function (request) {

};
page.onError = function (msg, trace) {

};
page.onNavigationRequested = function () {

};

function getSitePath(site) {
    var siteDir = site.replace(/^https?:\/\//, '').replace(/\.(.*?)(\/|$)?/g, '_$1').replace(/\/$/, '').replace(/[\/#]/g, '_');
    return destname + '/' + siteDir + '/' + datePath + '.png';
}
function getSiteMPath(sitePath) {
    return sitePath.replace(/\.png$/, '_m.png');
}
// 设置PC参数
function setPC() {
    page.viewportSize = { width: 1024, height: 768 };
    page.clipRect = { top: 0, left: 0};
    page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

}
// 设置手机参数
function setMobile() {
    page.viewportSize = { width: 375, height: 667 };
    page.clipRect = { top: 0, left: 0};
    page.settings.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

}
// 截图
function photo(sites) {
    if (sites.length) {
        var site = sites.pop();
        var sitePath = getSitePath(site);
        var siteMPath = getSiteMPath(sitePath);
        photoPC(site, sitePath, function (status) {
            if (!status) {
                photoMobile(site, siteMPath, function (status) {
                    // loop
                    if (status) {
                        loggerFail(site, true);
                    }
                    photo(sites);
                });
            } else {
                loggerFail(site, false);
                photo(sites);
            }
        });
    } else {
        done();
    }
}
// 截图网页
function photoPage(site, sitePath, cb) {
    page.open(site, function(status) {
        if (status !== 'success') {
            console.log('Unable to load the address!' + site);
            cb && cb('fail');
        } else {
            setTimeout(function () {
                page.render(sitePath, {
                    format: 'png'
                });
                cb && cb();
            }, 5 * 1000);
        }
    });
}
// 截图手机版
function photoMobile(site, sitePath, cb) {
    setMobile();
    photoPage(site, sitePath, cb);
}
// 截图电脑版
function photoPC(site, sitePath, cb) {
    setPC();
    photoPage(site, sitePath, cb);
}
// 站点加载失败收集
function loggerFail (site, isMobile) {
    if (!LoadError[site]) {
        LoadError[site] = {};
    }
    LoadError[site][isMobile ? 'mobile' : 'pc'] = true;
}
// 截图完成
function done() {
    if (Object.keys(LoadError).length) {
        fs.write(destname + '/error/' + datePath + '.json', JSON.stringify(LoadError, null, '\t'));
    }
    phantom.exit();
}
function getSitesName() {
    var siteName = system.args[1];
    return siteName;
}

function run() {
    try {
        var sites = fs.read(getSitesName());
        sites = JSON.parse(sites);
    } catch (e) {
        console.log(e);
        phantom.exit();
    }
    var sitesKeys = Object.keys(sites);
    photo(sitesKeys);
}

run();
