var fs = require('fs'),
    schedule = require("node-schedule"),
    tools = require('../module/tools'),
    startMass = require("./startMass");

module.exports = function( query ){
    var mode = query.mode,
        username = query.username,
        platform = query.platform,
        time = query.time,
        app_id = query.app_id,
        title = query.title,
        task,
        timeParams,
        isNew = !query.taskIndex;
        task_index = query.taskIndex || +new Date();


    var writeLoger = function(mode, data, taskIndex){

        var status = 0;

        if( data.ret == 0) {
            status = 1;
        } else {
            status = -1;
        }


        tools.updateInterval(username, platform, taskIndex, function( obj ){
            obj.prevTime = new Date().format("yyyy-MM-dd hh:mm:ss");
            obj.successStatus = status;
            if( obj.excuteNum != undefined ) {
                obj.excuteNum++;
            } else {
                obj.excuteNum = 1;
            }

            if( mode == 1 ) {
                obj.state = -1;
            }

            return obj;
        });

    };

    if( mode == 0) {
        var rule = new schedule.RecurrenceRule();
        timeParams = time.replace(/\s+/, '').split(/:/);
        rule.hour = +timeParams[0];
        rule.minute = +timeParams[1];
        rule.second = +timeParams[2];

        task = schedule.scheduleJob(rule, function(){
            startMass({
                platform_name : platform,
                taskIndex : task_index,
                cb : function( data, taskIndex, app_id, platform_name, title ){
                    writeLoger( data, taskIndex);
                }
            });
        });

    } else if( mode == 1){
        timeParams = time.split(/\D/);
        var date =  new Date(
            +timeParams[0],
            +timeParams[1] - 1,
            +timeParams[2],
            +timeParams[3],
            +timeParams[4],
            +timeParams[5]);

        task = schedule.scheduleJob(date, function(){
            startMass({
                platform_name : platform,
                taskIndex : task_index,
                app_id : app_id,
                title : title,
                cb : function( data, taskIndex, app_id, platform_name, title ){
                    writeLoger( data, taskIndex);
                }
            });
        });
    }

    taskObj[username] = taskObj[username] || {};

    if( mode == 0 ) {
        taskObj[username].multi = taskObj[username].multi || {};
        taskObj[username].multi[task_index] = task;
    } else if( mode == 1) {
        taskObj[username].single = taskObj[username].multi || {};
        taskObj[username].single[task_index] = task;
    }

    var taskData = {
        taskIndex : task_index,
        mode : mode,
        platform : platform,
        time : time,
        app_id : app_id || null,
        title : title || null,
        state : 1
    };

    if( isNew ) {
        tools.addUserlist({
            user : username,
            plat_name : platform,
            data : taskData
        }, 'interval');
    }


   return [taskData];

};