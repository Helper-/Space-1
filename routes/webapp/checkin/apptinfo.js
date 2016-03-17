var style = require('./../../../lib/style.js');

/**
 * Retrieves the appoitnment information to the check in page
 *
 * @param req and res The two parameters passed in to get checkin and the appoinment info
 * @returns the appointment's information
 */
exports.get = function (req, res, next) {

    var db = req.db;
    var appointments = db.get('appointments');
    var business = req.session.business;

    // find the appointments and render them to the screen
    appointments.findById(req.session.appointmentId, function(err, appointment) {

        // error checks for no appointments
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
