var auth = require('../../../lib/auth');

/**
 * Takes an req parameter and res parameter and returns the dashboard of the
 * company using the app. Retrieves the business's particular employeees.
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The business's employees and their dashboard
 */
exports.get = function (req, res) {

    var employees = req.db.get('employees');
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;
	var businessId = req.user[0].business;
	var role = req.user[0].role;

	var businesses = req.db.get('businesses').find();

    businesses.then(function(doc) {next();}, function(err){});

    // render the dashboard and the business's data
	if(role === 'admin' || role === 'receptionist' || role === 'employee' || role === 'SuperAdmin') {

	  res.render('business/dashboard', {
	    eid: employeeId,
        employeeName: employeename,
        bid: businessId,
        message: req.flash("permission"),
      });
	}

    // only show the checkin page if we are using a check in account as log in
	if(role === 'checkin') {
		var businessId = req.user[0].business;
        var business = req.user[0].business;

		res.redirect('/office/checkin');
	}
};
