var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    var db = req.db;
    var appointments = db.get('appointments');
    var business = req.session.business;

    appointments.findById(req.session.appointmentId, function(err, appointment) {
        if (err) {
            return next(err);
        }
        if(!appointment) {
            return next(new Error('Appointment from session not found: ' + req.session.appointmentId));
        }

        res.render('checkin/apptinfo', {
            name: appointment.fname,
            DOB: appointment.dob,
            email: appointment.email,
            companyName: business.companyName,
            bg: business.bg,
            logo: business.logo,
            buttonBg: style.rgbObjectToCSS(business.buttonBg),
            buttonText: style.rgbObjectToCSS(business.buttonText),
            containerText: style.rgbObjectToCSS(business.containerText),
            containerBg: style.rgbObjectToCSS(business.containerBg)
        });
    });
};
