
/*
 * GET home page.
 */
var tools = require('../module/tools');

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

    res.render('index', {
        title: '微信公众平台定时发布文章',
        userlists : userlists,
        plat_lists : plat_lists,
        taskList : taskList,
        fsend_lists : []
    });

};