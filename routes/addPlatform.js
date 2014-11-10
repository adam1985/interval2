var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb,
        token = req.query.token,
        name = req.query.name,
        username = req.query.user_name,
        pwd = req.query.pwd,
        userlist = tools.getUserlist(),
        userStatus = tools.getUserName( userlist, token);

    if( userStatus.has ){
        var platform = userlist[userStatus.username].platform || [],
            info = userlist[userStatus.username].info || {};

        if( info.platform_a > platform.length ) {
            if( tools.hasPlatform( platform, username) ) {
                tools.interfaceDone( res, {
                    success : false,
                    msg : "该公众平台已添加过，不要重复添加!"
                }, callback);

            } else {
                platform.push({
                    name : name,
                    username : username,
                    pwd : pwd
                });

                userlist[userStatus.username].platform = platform;

                tools.setUserlist( userlist );

                tools.interfaceDone( res, {
                    success : true,
                    msg : "添加成功!"
                }, callback);
            }
        } else {
            tools.interfaceDone( res, {
                success : false,
                msg : "添加公众平台数量不得超过" + info.platform_a + "个!"
            }, callback);
        }

    } else {
        tools.interfaceDone( res, {
            success : false,
            msg : "输入token不正确，请重新输入!"
        }, callback);
    }

};