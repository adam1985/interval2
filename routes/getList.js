
var rootPath = process.cwd(),
    tools = require('../module/tools'),
    login = require('./login'),
    getMassList = require('./getMassList');

module.exports = function(username, platform_name, cb){
    var userlist = tools.getUserlist(),
        plat = tools.getPlat(username, platform_name);

    login.loginWeixin(plat.username, plat.pwd, function( loginRes, cookie ){
        if(loginRes.base_resp.ret == 0) {
            var redirect_url = loginRes.redirect_url,
                rex = /token=(\d+)/;
                rex.test( redirect_url );
                var token = RegExp.$1;

            getMassList(platform_name, token, cookie, function(fsend_lists){
                cb && cb( fsend_lists );
            });

        }
    });

};