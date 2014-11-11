var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb,
        token = req.query.token,
        userlist = tools.getUserlist(),
        userStatus = tools.getUserName( userlist, token),
        platform_lists = userStatus.platform_lists || [];

    if( userStatus.has ){
        var plat_list = (function(){
            var plat_list_ = [];
            tools.each(platform_lists, function(i, v){
                plat_list_.push({
                    name : v.plat_info.name,
                    username : v.plat_info.username
                });
            });
            return plat_list_;
        }());

        tools.interfaceDone( res, {
            success : true,
            data : {
                platform_lists : plat_list,
                token : token
            }
        }, callback);
    } else {
        tools.interfaceDone( res, {
            success : false,
            msg : "没有找到该token相关的公众平台，请查检token是否输入正确!"
        }, callback);
    }
};