var auth = require('../../../lib/auth');
var ObjectID = require('mongodb').ObjectID;

exports.get = function (req, res) {
	var employees = req.db.get('employees');
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;
	var businessId = req.user[0].business;
	var role = req.user[0].role;
    var adminCheck = (role === 'admin') ? true : false;

	if(role === 'admin' || role === 'receptionist' || role === 'employee' || role === 'SuperAdmin') {
	  res.render('business/dashboard', {
	    eid: employeeId,
			employeeName: employeename,
			bid: businessId,
            adminFlag: adminCheck,
			message: req.flash("permission"),
		});
	}

	if(role === 'checkin') {
        var businessId = req.user[0].business;
        console.log(businessId);
        var business = req.user[0].business;

        res.redirect('/office/checkin');
//		res.render('checkin/checkin', {
//        companyName: business.companyName,
//        bg: business.bg,
//        logo: business.logo,
//    });
    }
};
