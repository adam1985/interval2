var crypto = require('crypto'),
    ng = require('nodegrass'),
    querystring = require("querystring");

module.exports = function(req, res) {

    res.render('login', {
        title: '用户登录'
    });

};
