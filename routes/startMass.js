var ng = require('nodegrass'),
    querystring = require("querystring"),
    getMassList = require("./getMassList"),
    getSeq = require("./getSeq");

var sendMass = function(operation_seq, token, app_id, cookie, cb){
    var query = {
        t : "ajax-response",
        token : token,
        lang : "zh_CN"
    },
    options = {
        token :	token,
        lang :	"zh_CN",
        f : 	"json",
        ajax : 	1,
        random : Math.random(),
        type : 	10,
        appmsgid : 	app_id,
        cardlimit : 1,
        sex	: 0,
        groupid :	-1,
        synctxweibo : 1,
        country : "",
        province : "",
        city : "",
        imgcode : "",
        operation_seq : operation_seq
    },
    paramStr = querystring.stringify( query),
    contentLength = querystring.stringify( options).length;

    ng.post('https://mp.weixin.qq.com/cgi-bin/masssend?' + paramStr,function(data, status, header){
        cb && cb(JSON.parse(data));
    }, {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Content-Length": contentLength,
        "Cookie" : cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "Host" : "mp.weixin.qq.com",
        "Origin" : "http://mp.weixin.qq.com",
        "Referer" :	"https://mp.weixin.qq.com/cgi-bin/masssendpage?t=mass/send&token=" + token + "&lang=zh_CN"
    }, {
        token :	token,
        lang :	"zh_CN",
        f : 	"json",
        ajax : 	1,
        random : Math.random(),
        type : 	10,
        appmsgid : 	app_id,
        cardlimit : 1,
        sex	: 0,
        groupid :	-1,
        synctxweibo : 1,
        country : "",
        province : "",
        city : "",
        imgcode : "",
        operation_seq : operation_seq
    }, 'utf8');
};

module.exports = function( config ){
    var username = config.username,
        plat_name = config.platform_name,
        plat_info = tools.getPlat(username, plat_name),
        prevDay,
        curDay = new Date().getDate();

    dailyObj[username] = dailyObj[username] || {};

    prevDay = dailyObj[username][plat_name];

    if( prevDay != curDay ) {

        console.log('用户：' + username + '，平台：' + plat_name + ' mass start');
        getSeq(plat_info.username, plat_info.pwd, function(operation_seq, token, loginRes, cookie){
            var app_id = config.app_id;
            if( !app_id ) {
                getMassList(plat_name, token, cookie, function(fsend_lists){
                    if( fsend_lists.length ) {
                        fsend_lists = fsend_lists.reverse();
                        app_id = fsend_lists[0].app_id;
                        var title;

                        if( !config.title ) {
                            title = fsend_lists[0].title;
                        }

                        sendMass(operation_seq, token, app_id, cookie, function(data){
                            console.log('用户：' + username + '，平台：' + plat_name + ' mass complete', data);
                            dailyObj[username][plat_name] = curDay;
                            config.cb(data, config.taskIndex, app_id, plat_name, title || null);
                        });
                    }
                });
            } else {
                sendMass(operation_seq, token, app_id, cookie, function(data){
                    console.log('用户：' + username + '，平台：' + plat_name + ' mass complete', data);
                    dailyObj[username][plat_name] = curDay;
                    config.cb(data, config.taskIndex, app_id, plat_name, config.title);
                });
            }
        });
    }
};



