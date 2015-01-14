// login.js
var mongoose = require('mongoose');

var User = require('./models/User');
module.exports = {
    login: function(username, password, outer_callback) {

        mongoose.connection.close();
        mongoose.connect('mongodb://localhost/mydb');

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function(callback) {
            console.log('connection success:');

            User.findOne({
                username: username,
                password: password
            }, function(err, user) {
                if (err) {
                    outer_callback(true);
                } else {
                    if (user === null) {
                        // outer_callback(true);
                        var new_user = new User({
                            username: username,
                            password: password
                        });
                        new_user.save(function(err) {
                            if (err) {
                            	outer_callback(true);
                                console.log('save new user error');
                            }

                            outer_callback(false);
                        });
                    } else {
                        var new_user = new User({
                            username: username,
                            password: password
                        });
                        new_user.save(function(err) {
                            if (err) {
                            	outer_callback(true);
                                console.log('save new user error');
                            }

                            outer_callback(false);
                        });
                    }
                }
            });
        });
    }
}
