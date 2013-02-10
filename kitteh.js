// Module dependencies.
var express = require ('express'),
    port = process.env.PORT || 2345,
    routes = require ('./routes');

var app = module.exports = express ();

// Configuration
app.configure (function (){
  app.use(express.favicon(__dirname + '/public/img/favicon.ico')); 
  app.set ('views', __dirname + '/views');
  app.set ('view engine', 'jade');
  app.use (express.bodyParser ());
  app.use (express.methodOverride ());
  app.use (app.router);
  app.use (express.static (__dirname + '/public'));
});

// View stuff
app.set ('view engine', 'jade')
app.use (express.logger ('dev'))
app.use (express.static (__dirname + '/public'))

app.configure ('development', function (){
  app.use (express.errorHandler ({ dumpExceptions: true, showStack: true })); 
});

app.configure ('production', function (){
  app.use (express.errorHandler ()); 
});

// Routes
app.get ('/', routes.index);
app.get ('/rnd', routes.random);
app.get ('/del/:id', routes.del);

// Startup
app.listen (port);
console.log ("Express server listening on port %d in %s mode", port, app.settings.env);
