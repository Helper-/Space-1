var auth = require('../../../lib/auth');

exports.get = function (req, res) {
    var employeeId = req.user[0]._id;
    var employeename = req.user[0].fname;
    var businessId = req.user[0].business;
    var role = req.user[0].role;

    if(role === 'admin') {
        res.render('business/admindashboard', {
            eid: employeeId,
            employeeName: employeename,
            bid: businessId,
            message: req.flash("permission")
        });
    }

};
