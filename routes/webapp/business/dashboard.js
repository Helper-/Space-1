var auth = require('../../../lib/auth');

exports.get = function (req, res) {
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;
	var businessId = req.user[0].business;
    var adminCheck = (req.user[0].role === 'admin') ? true : false;

  res.render('business/dashboard', {
    eid: employeeId,
		employeeName: employeename,
		bid: businessId,
        adminFlag: adminCheck,
		message: req.flash("permission"),
	});
};
