var express = global.express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.use(express.cookieParser('auth'));
app.use(express.session({
    secret: "o12akosdfo2uj30=--aqsad7345872sa",
    cookie: {
        maxAge  : 24 * 60 * 60 * 1000 // warning: cookie updates on every request manually (req.session._garbage = Date(); req.session.touch();)
    }
}));

require("coffee-script");
var docpadInstanceConfiguration = require('./docpad');
docpadInstanceConfiguration.serverExpress = app;
docpadInstanceConfiguration.serverHttp = server;

var docpadInstance = require('docpad').createInstance(docpadInstanceConfiguration, function(err){
    if (err)  return console.log(err.stack);

    docpadInstance.action('generate server watch', function(err){
        if (err)  return console.log(err.stack);
    });
});
