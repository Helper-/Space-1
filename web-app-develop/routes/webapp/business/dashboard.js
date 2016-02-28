var auth = require('../../../lib/auth');
//var mailerClient = require('../../../mailer-client');
//var twilioClient = require('../../../twilio-client');

exports.get = function (req, res) {

	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    res.render('business/dashboard', {title: 'Express',
        eid: employeeId,
		employeeName: employeename,
		message: req.flash("permission"),
	});

    //mailerClient.sendSimpleEmail("michael.chang25@gmail.com", "Calling all doctors!", "This is an automated message");
    //twilioClient.sendSmsToPhoneNumber("+16508623873", "Paging all doctors!");
};
