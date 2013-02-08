// Module dependencies.
var express = require('express'),
  stylus = require('stylus'),
  nib = require('nib'),
  routes = require('./routes');

var app = module.exports = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// View stuff
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', routes.index);

// Startup
app.listen(2345);
console.log("Express server listening on port %d in %s mode", '2345', app.settings.env);
