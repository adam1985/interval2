var tools = require('../module/tools');

module.exports = function(req, res){
	var userlist = tools.getUserlist(), user_list = [];
    tools.each( userlist, function(key, val){
        user_list.push( val );
    });

    res.render('userlist', {
        title: '用户列表',
        userlist : user_list
    });

};