var tools = require('../module/tools'),
    startTask = require("./startTask");

module.exports = function( req, res ){
    var callback = req.query.cb,
        taskIndex = req.query.taskIndex,
        userlist = tools.getUserlist(),
        interval_lists = [],
        single_interval;

    tools.each(userlist, function(key, val){
        var plat_list = val.platform || [];
        tools.each(plat_list, function(i, v){
            var inter_list = v.interval_list || [];
            tools.each(inter_list, function(index, value){
                if( value.state == 1 ) {
                    if( value.taskIndex == taskIndex) {
                        single_interval = value;
                    }
                    interval_lists.push( value );
                }
            });
        });
    });


    if( taskIndex ){
        if( single_interval ) {
            startTask( single_interval, function(){
                tools.interfaceDone(res, {
                    success : true
                }, callback);
            });
        } else {
            tools.interfaceDone(res, {
                success : false,
                msg : '没有找到该定时任务!'
            }, callback);
        }

    } else {
        var len = interval_lists.length, index = 0;
        (function(){
            var arg = arguments;

            if( index < len ){

                startTask( interval_lists[index], function(){
                    index++;
                    arg.callee();
                });

            } else {

                tools.interfaceDone(res, {
                    success : true
                }, callback);

            }

        }());
    }
};