
var tools = require('../module/tools');

module.exports = function(req, res){
    var username = req.query.username,
    	callback = req.query.cb;

    var plat_lists =  [],
        taskList = [];

    if( username ){
        plat_lists = tools.getAllPlat( username ) || [];
        taskList = tools.getAllInterval( username ) || [];
    }

    tools.interfaceDone(res,  {
        success : true,
        data : {
            plat_lists : plat_lists,
            taskList : taskList
        }
    }, callback);

};