
var tools = require('../module/tools');

module.exports = function(req, res){
    var username = req.query.username,
        token = req.query.token,
        userlist,
        userStatus = {
            has : false
        },
    	callback = req.query.cb;

        if( token ){
            userlist = tools.getUserlist();
            userStatus = tools.getUserName( userlist, token);

        }

        if( userStatus.has ){
            username = userStatus.username;
        }

    var plat_lists =  [],
        taskList = [];

    if( username ){
        plat_lists = tools.getAllPlat( username ) || [];
        taskList = tools.getAllInterval( username ) || [];
        tools.interfaceDone(res,  {
            success : true,
            data : {
                plat_lists : plat_lists,
                taskList : taskList
            }
        }, callback);
    } else {
        tools.interfaceDone(res,  {
            success : false,
            msg : "没有找到该用户!"
        }, callback);
    }



};