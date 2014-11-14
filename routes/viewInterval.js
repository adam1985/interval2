var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb,
        taskInex = req.query.taskIndex;

    if ( taskInex ) {
        tools.interfaceDone(res, {
            success : true,
            data : {
                has : tools.hasInterval( taskInex )
            }
        }, callback);
    } else {
        res.render('viewInterval', {
            title: '查看定时任务',
            data : taskObj
        });
    }

};