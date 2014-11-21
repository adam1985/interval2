var crypto = require('crypto'),
    fs = require('fs'),
    tools = require('../module/tools'),
    rootPath = process.cwd();

module.exports = function(req, res){
    var tmpName = 'interval2',
        hasher = crypto.createHash("md5"),
        query = req.query,
        userlist = tools.getUserlist();

    hasher.update(query.user_name + tmpName);
    query.token =  hasher.digest('hex');

    userlist[query.user_name] = userlist[query.user_name] || {};

    userlist[query.user_name].info = query;

    tools.setUserlist( userlist );

    res.redirect('/userlist?airen=yuanyuan');

};