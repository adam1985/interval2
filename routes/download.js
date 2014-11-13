
module.exports = function(req, res){
    res.download(process.cwd() + '/config/user.json');
};