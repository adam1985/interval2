var fs = require('fs'),
    rootPath = process.cwd(),
    tools = require('../module/tools');

module.exports = function(req, res){
    var taskIndex = req.query.taskindex,
        username = req.query.username,
        plat_name = req.query.plat_name,
        mode = req.query.mode,
        callback = req.query.cb;

   if ( tools.removeUserlist( {
       user : username,
       plat_name : plat_name,
       mode : mode,
       taskIndex : taskIndex
   }, 'interval') ){
       tools.interfaceDone(res, {
           success : true
       }, callback);
   } else {
       tools.interfaceDone(res, {
           success : false
       }, callback);
   }

};