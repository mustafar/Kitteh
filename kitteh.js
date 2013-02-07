
/**
 * Module dependencies.
 */

var express = require('express')
  , pg = require('pg')
  , canvas = require('canvas')
  , kittydar = require('kittydar')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

var connString = "tcp://postgres@localhost/apps",
    dbClient = new pg.Client(connString);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(2345);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
