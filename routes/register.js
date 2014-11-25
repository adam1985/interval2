var crypto = require('crypto'),
    ng = require('nodegrass'),
    querystring = require("querystring");

module.exports = function(req, res) {

    res.render('register', {
        title: '用户注册'
    });

};

