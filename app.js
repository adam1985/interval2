
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , getSeqList = require('./routes/getSeqList')
  , getUserInfo = require('./routes/getUserInfo')
  , addTask = require('./routes/addTask')
  , removeTask = require('./routes/removeTask')
  , viewInterval = require('./routes/viewInterval')

  , addpage = require('./routes/addpage')
  , adduser = require('./routes/adduser')
  , addPlat = require('./routes/addPlat')
  , removeuser = require('./routes/removeuser')
  , userlist = require('./routes/userlist')

  , addPlatform = require('./routes/addPlatform')
  , removePlatform = require('./routes/removePlatform')
  , platformlist = require('./routes/platformlist')

  , download = require('./routes/download')

  , restartAllTask = require('./routes/restartAllTask');

global.taskObj = {};
global.dailyObj = {};

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get(/^\/(?!assets|client)/, function(req, res, next){
    var query = req.query || {}, queryLen = Object.keys( query ).length ;
    console.log(queryLen == 1 && query.airen == 'yuanyuan');
    if( queryLen > 1 || queryLen == 1 && query.airen == 'yuanyuan' ) {
        next();
    } else {
        res.send(403, 'forbidden!');
    }
});

app.get('/', routes.index);
app.get('/getSeqList', getSeqList);
app.get('/getUserInfo', getUserInfo);
app.get('/removeTask', removeTask);
app.get('/addTask', addTask);
app.get('/viewInterval', viewInterval);
app.get('/addpage', addpage);
app.get('/adduser', adduser);
app.get('/addPlat', addPlat);
app.get('/removeuser', removeuser);
app.get('/userlist', userlist);
app.get('/addPlatform', addPlatform);
app.get('/removePlatform', removePlatform);
app.get('/platformlist', platformlist);
app.get('/download', download);
app.get('/restartAllTask', restartAllTask);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
