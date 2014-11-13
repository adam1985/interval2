var fs = require('fs'),
    tools = require('../module/tools'),
    startTask = require('./startTask');

module.exports = function(req, res){
    var callback = req.query.cb,
        userlist = tools.getUserlist(),
        username = req.query.username,
        mode = req.query.mode,
        counts = tools.getCounts( username );
        info = userlist[username].info;

    if( mode == 0 ){
        if( counts.multi < +info.multiple_a ) {
            tools.interfaceDone(res, {
                success : true,
                data : startTask( req.query )
            }, callback);
        } else {
            tools.interfaceDone(res, {
                success : false,
                msg : '重复执行定时任务不能超过' + info.multiple_a + '个'
            }, callback);
        }
    }else if( mode == 1 ) {
        if( counts.single < +info.single_a ) {
            tools.interfaceDone(res, {
                success : true,
                data : startTask( req.query )
            }, callback);
        } else {
            tools.interfaceDone(res, {
                success : false,
                msg : '单次执行定时任务不能超过' + info.single_a + '个'
            }, callback);
        }
    }



};