var auth = require('../../../lib/auth');
var ObjectID = require('mongodb').ObjectID;

exports.get = function (req, res) {

    var db = req.db;
    var businesses = db.get('businesses');
    //var ownerfirst = businesses.user[0].fname;
    //var ownerlast = businesses.user[0].lname;
    //var lastlogin = businesses.user[0].checkin;

    businesses.find({

    });
};
