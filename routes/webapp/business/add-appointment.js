var auth = require('../../../lib/auth');

exports.get = function(req,res) {
    res.render('business/add-appointment.hjs');
};

exports.post = function(req,res) {
    var db = req.db;
    var appointments = db.get('appointments');
    var night = req.body.night;
    var year = Number(req.body.year);
    var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'].indexOf(req.body.month);
    var day = Number(req.body.day);
    var hour = Number(req.body.hour) +6;
    var minute =Number(req.body.minute);

    if(night === "PM") {
        hour += 12;
    }

    var date = new Date(year, month, day, hour, minute);

    console.log('Date: ');
    console.log(date);
    console.log(hour);
    console.log(minute);
    console.log('req.user[0]:');
    console.log(req.user[0]);
    console.log('req.body:');
    console.log(req.body);

    appointments.insert({
        business : req.user[0].business,
        employee : req.user[0]._id,
        date : date,
        fname : req.body.fname,
        lname : req.body.lname,
        email : req.body.email,
        phone : req.body.phone,
        state : 'Upcoming'
    });
    res.redirect('dashboard#close');
};

exports.delete = function(req,res) {

};
