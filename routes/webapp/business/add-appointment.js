var auth = require('../../../lib/auth');

exports.get = function(req,res) {
    res.render('business/add-appointment.hjs');
};

exports.post = function(req,res) {
    var db = req.db;
    var appointments = db.get('appointments');
    var year = document.getElementById("yeardropdown");
    var month = document.getElementById("monthdropdown");
    var day = document.getElementById("daydropdown");
    var hour = document.getElementById('hourdropdown');
    var minute = document.getElementById("minutedropdown");
    var date = new Date(year,month,day,hour,minute);

    console.log('Date: ');
    console.log(date);
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
