var tools = require('../module/tools');

module.exports = function(req, res){
    res.render('addpage', {
        title: '微信公众平台定时发布文章'
    });

};