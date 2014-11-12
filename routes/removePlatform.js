var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb,
        token = req.query.token,
        plat_name = req.query.plat_name,
        userlist = tools.getUserlist(),
        userStatus = tools.getUserName( userlist, token),
        user = userStatus.username;

    if( userStatus.has ){
        if( tools.removeUserlist( {
            user : user,
            plat_name : plat_name
        }, 'platform' )) {
            tools.interfaceDone( res, {
                success : true,
                msg : "删除成功!!"
            }, callback);
        } else {
            tools.interfaceDone( res, {
                success : false,
                msg : "没有找到该公众平台，删除失败!"
            }, callback);
        }
    } else {
        tools.interfaceDone( res, {
            success : false,
            msg : "没有找到该token相关的公众平台，请查检token是否输入正确!"
        }, callback);
    }
};

