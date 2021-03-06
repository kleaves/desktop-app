const { app, protocol } = require('electron');
var File = require('./file_main');

var leanoteProtocol = {
    destroy: function(callback) {
        protocol.unregisterProtocol('leanote', function() {
            callback();
        });
    },
    init: function() {
        // 先注销, 为了防止刷新
        // this.destroy(funciton () {
        let ok = protocol.registerFileProtocol('leanote', function(request, callback) {
            // console.log(request.url);
            var url = request.url;
            var ret = /fileId=([a-zA-Z0-9]{24})/.exec(url);
            if (ret && ret[1]) {
                var fileId = ret[1];
                // console.log('imageId: ' + fileId);

                File.getImage(ret[1], function(fileLocalPath) {
                    if (fileLocalPath) {
                        // console.log(fileId + ' : ' + fileLocalPath);
                        callback({ path: fileLocalPath });
                    } else {
                        console.log('取不到图片: ' + fileId);
                        callback();
                    }
                });
            } else {
                // js, 请求, 导出pdf
                // leanote://public/a.js
                console.log(url);
                var prefix = 'leanote://public';
                // leanote://public/libs/MathJax/MathJax.js?config=TeX-AMS_HTML Failed to load resource: net::ERR_FILE_NOT_FOUND
                if (url.substr(0, prefix.length) == prefix) {
                    var path = app.getAppPath() + url.substr('leanote:/'.length);
                    if (path.indexOf('?') >= 0) {
                        path = path.substr(0, path.indexOf('?'));
                    }
                    callback({ path: path });
                }
            }
            // var url = request.url.substr(7);
            // callback({path: '/Users/life/Desktop/newicon/blog@2x.png'});
        });

        if (!ok) {
            console.error('Failed to register protocol')
        }
        // });
    }

}

module.exports = leanoteProtocol;