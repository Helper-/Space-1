/**
 * Loads ObjectID from MongoDB module, mongodb.
 */
var ObjectID = require('mongodb').ObjectID;

/**
 * Obtains all appointments for today for the given employee.
 */
exports.get = function (req, res) {
    var db = req.db;
    var appointments = db.get('appointments');
    var employees = db.get('employees');

    //Get the start and end of today
    var begin = new Date();
    begin.toLocaleDateString();
    begin.setHours(0,0,0,0);
    var end = new Date();
    end.toLocaleDateString();
    end.setHours(23, 59, 59, 999);

    console.error("req.params.eid: " + req.params.eid);
    console.error("req.user[0]._id" + req.user[0]._id);


    // Check if employee is admin or receptionist
    employees.find({
        _id : ObjectID(req.params.eid)
        //admin : true,
        //role : 'admin',
    },
    {sort : {date: 1}},function(err, results){
        if (err) {
            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
            return res.send(500);
        }

        // if employee is admin or receptionist, display all appointments
        if(results[0]){

            appointments.find({
                business: results[0].business,
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

        // otherwise display only appointments of the employee
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
    //employees.find({
    //    employee: ObjectID(req.params.eid),
    //    //date: {
    //    //    $gte: begin,
    //    //    $lte: end
    //    //}
    //},{sort : {date: 1}}, function (err, results) {
    //    if (err) {
    //        console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
    //        return res.send(500);
    //    }
    //    res.json(results);
    //});
};
