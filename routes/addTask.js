var fs = require('fs'),
    tools = require('../module/tools'),
    startTask = require('./startTask');

module.exports = function(req, res){

    tools.interfaceDone(res, {
        success : true,
        data : startTask( req.query )
    }, callback);

};