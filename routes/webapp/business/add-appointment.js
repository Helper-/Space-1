var auth = require('../../../lib/auth');

exports.get = function(req,res) {
    res.render('business/add-appointment.hjs');
};

exports.post = function(req,res) {
    var db = req.db;
    var appointments = db.get('appointments');
    var date = new Date();
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
    res.redirect('dashboard');
};

exports.delete = function(req,res) {

};
