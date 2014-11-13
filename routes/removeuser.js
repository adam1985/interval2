var tools = require('../module/tools');

module.exports = function(req, res){
    var callback = req.query.cb,
        username = req.query.username;

        if( tools.removeUserlist( {
            user : username
        }, 'user' )) {
            tools.interfaceDone( res, {
                success : true,
                msg : "删除成功!!"
            }, callback);
        } else {
            tools.interfaceDone( res, {
                success : false,
                msg : "没有找到该用户，删除失败!"
            }, callback);
        }
};

