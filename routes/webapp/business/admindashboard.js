var auth = require('../../../lib/auth');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/breeze';

exports.get = function (req, res) {
    var employeeId = req.user[0]._id;
    var employeename = req.user[0].fname;
    var businessId = req.user[0].business;
    var role = req.user[0].role;
    var jsonResults = 0;
    //var db = req.db;
    //console.log(db);
    //var businesses = db.get('businesses');

    //var myCursor = businesses.find();
    //var myDocument = myCursor.hasNext() ? myCursor.next() : null;
    //
    //if (myDocument) {
    //    var myName = myDocument.business;
    //    console.log(tojson(myName));
    //}
    //jsonResults = JSON.stringify(businesses);//res.json(businesses);
    //console.log(jsonResults);

    //businesses.find('business',
    //    function (err, results) {
    //        if (err) {
    //            console.error('MongoDB Error in /businesses: ' + err);
    //            return res.send(500);
    //        }
    //        //jsonResults = res.json(results);
    //        console.log(results);
    //
    //    });

    var db = req.db;
    var findBusinesses = function(db, callback) {
      var cursor = db.collection('businesses').find();
        cursor.each(function(err, doc){
           assert.equal(err, null);
            if (doc != null) {
                console.log(doc);
            }
            else {
                callback();
            }
        });
    };
    findBusinesses();

    if(role === 'admin') {
        res.render('business/admindashboard', {
            eid: employeeId,
            employeeName: employeename,
            bid: businessId,
            message: req.flash("permission"),
            //json:jsonResults
        });
    }


};


