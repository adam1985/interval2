
/*
 * GET home page.
 */
var rootPath = process.cwd(),
    ng = require('nodegrass'),
    querystring = require("querystring"),
    fs = require('fs'),
    tools = require('../module/tools');

exports.index = function(req, res){
    if( req.query.airen != 'yuanyuan') {
        res.send(403, 'forbidden!');
    }

    var userlists =tools.getAllUser() || [],
        curUsername = userlists[0],
        plat_lists =  [],
        taskList = [];

    if( curUsername ){
        plat_lists = tools.getAllPlat( curUsername ) || [];
        taskList = tools.getAllInterval( curUsername ) || [];
    }

    console.log(taskList);

    res.render('index', {
        title: '微信公众平台定时发布文章',
        userlists : userlists,
        plat_lists : plat_lists,
        taskList : taskList,
        fsend_lists : []
    });

};