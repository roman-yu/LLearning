var http = require('http');
var url = require('url');
var mysql = require('mysql');

var express = require('express');
var bodyParser = require('body-parser');

var uuid = require('node-uuid');

var mongoose = require('mongoose');

var app = express();

var auth = require('./auth.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    var token = uuid.v1();

    mongoose.connection.close();
    mongoose.connect('mongodb://localhost/mydb');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(callback) {
        // yay!
        console.log('connection success:');
    });

    res.send('The token is + ' + token + '\n');
});

app.post('/auth', function(request, response) {

    var username = request.body.username;
    var password = request.body.password;

    auth.login(username, password, function(err) {
        if (err) {
            response.send('Authentication fail.\n');
        } else {
            var json = {
                token: uuid.v1()
            };
            response.send(JSON.stringify(json));
        }
    });
});
app.listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
