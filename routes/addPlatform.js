var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb,
        token = req.query.token,
        user = req.query.user,
        name = req.query.name,
        username = req.query.user_name,
        pwd = req.query.pwd,
        userlist = tools.getUserlist(),
        userStatus = {
            has : false
        };
        if( token ){
            userStatus = tools.getUserName( userlist, token);
            user = userStatus.username;
        } else {
            userStatus.has = !!userlist[user];
        }


    if( userStatus.has ){
        var plat_a = tools.getCounts( user ).plat,
            info = userlist[user].info || {};

        if( info.platform_a > plat_a ) {
            if( tools.hasPlatform( user, name ) ) {
                tools.interfaceDone( res, {
                    success : false,
                    msg : "该公众平台已添加过，不要重复添加!"
                }, callback);

            } else {
                if( tools.addUserlist({
                    user : user,
                    data : {
                        name : name,
                        username : username,
                        pwd : pwd
                    }
                }, 'platform') ) {
                    tools.interfaceDone( res, {
                        success : true,
                        msg : "添加成功!"
                    }, callback);
                } else {
                    tools.interfaceDone( res, {
                        success : false,
                        msg : "添加失败!"
                    }, callback);
                }

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