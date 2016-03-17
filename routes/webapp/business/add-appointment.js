var auth = require('../../../lib/auth');
/**
 * Takes a req and res parameters and renders the add appointment page
 * @param req and res The two parameters passed in to get the appointments
 * @returns Renders the add appointment page
 */
exports.get = function(req,res) {
    res.render('business/add-appointment.hjs');
};

/**
 * Takes a req and res parameters and inputs a new appointment into the list of appointments
 * @param req and res The two parameters passed in to get the appointments and a new appointment
 * @returns The new appointment data
 */
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

    // insert appointment to the list of appointments
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
