//var auth = require('../../../lib/auth');
//var ObjectID = require('mongodb').ObjectID;
//
//exports.get = function (req, res) {
//
//    var db = req.db;
//    var businesses = db.get('businesses');
//    //var ownerfirst = businesses.user[0].fname;
//    //var ownerlast = businesses.user[0].lname;
//    //var lastlogin = businesses.user[0].checkin;
//
//    businesses.find({
//
//    });
//};

/**
 * Loads ObjectID from MongoDB module, mongodb.
 */
var ObjectID = require('mongodb').ObjectID;

/**
 * Obtains all appointments for today for the given employee.
 */
exports.get = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');

    //businesses.find({
    //
    //});
    //console.log(businesses);

    var appointments = db.get('appointments');
    var employees = db.get('employees');


    //Get the start and end of today
    var begin = new Date();
    begin.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    employees.find({
            _id : ObjectID(req.params.eid)
            //admin : true,
        },
        {sort : {date: 1}},function(err, results){
            if (err) {
                console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
                return res.send(500);
            }
            if(results[0]){

                appointments.find({
                        //  business: results[0].business,
                        date: {
                            $gte: begin,
                            $lte: end
                        }
                    },
                    {sort : {date: 1}},
                    function (err, results) {
                        if (err) {
                            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err );
                            return res.send(500);
                        }
                        res.json(results);
                    });
            }
            else{
                appointments.find({
                        employee: ObjectID(req.params.eid),
                        date: {
                            $gte: begin,
                            $lte: end
                        }
                    },
                    {sort : {date: 1}},
                    function (err, results) {
                        if (err) {
                            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
                            return res.send(500);
                        }
                        res.json(results);
                    });
            }
        });
};
