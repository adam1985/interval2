
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , getSeqList = require('./routes/getSeqList')
  , getPlatInfo = require('./routes/getPlatInfo')
  , addTask = require('./routes/addTask')
  , removeTask = require('./routes/removeTask')
  , viewInterval = require('./routes/viewInterval')

  , addpage = require('./routes/addpage')
  , adduser = require('./routes/adduser')
  , removeuser = require('./routes/removeuser')
  , userlist = require('./routes/userlist')

  , addPlatform = require('./routes/addPlatform')
  , removePlatform = require('./routes/removePlatform')
  , platformlist = require('./routes/platformlist');

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

app.get('/', routes.index);
app.get('/getSeqList', getSeqList);
app.get('/getPlatInfo', getPlatInfo);
app.get('/removeTask', removeTask);
app.get('/addTask', addTask);
app.get('/viewInterval', viewInterval);
app.get('/addpage', addpage);
app.get('/adduser', adduser);
app.get('/removeuser', removeuser);
app.get('/userlist', userlist);
app.get('/addPlatform', addPlatform);
app.get('/removePlatform', removePlatform);
app.get('/platformlist', platformlist);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
