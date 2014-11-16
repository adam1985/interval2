
var tools = require('../module/tools'),
	getList = require('./getList');

module.exports = function(req, res){
    var platform_name = req.query.platform_name,
    	username = req.query.username,
    	token = req.query.token,
    	userlist = tools.getUserlist(),
        userStatus = {
            has : false
        },
    	callback = req.query.cb;

    if( token ){
        userStatus = tools.getUserName( userlist, token );
    }

    if( userStatus.has ){
        username = userStatus.username;
    }

    if( username ) {
	    getList(username, platform_name, function(fsend_lists){

	        tools.interfaceDone(res, {
	            success : true,
	            data : fsend_lists
	        }, callback);

	    });

    } else {
    	tools.interfaceDone(res, {
            success : false,
            msg : "没有找到该用户!"
        }, callback);
    }


};