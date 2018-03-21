var express = require('express'),
	app = express(),
	// MongoClient = require('mongodb').MongoClient,
	path = require('path'),
	// assert = require('assert'),
	// bodyparser = require('body-parser'),
	engines = require('consolidate'),
	ejs = require('ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + '/views/');
app.engine('html', engines.ejs);
app.set('view_engine', 'html');
// app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
	res.render('index.html');
});

var server = app.listen(7000, function() {
	var port = server.address().port;
	console.log("Express listening on port " + port);
});