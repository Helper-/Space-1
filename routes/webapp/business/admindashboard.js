var async = require('async');

/**
 * Takes an req parameter and res parameter and returns the details of all business for
 * the administrator page.
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The businesses using the application
 */
exports.get = function (req, res) {

    var employeeId = req.user[0]._id;
    var employeename = req.user[0].fname;
    var businessId = req.user[0].business;
    var role = req.user[0].role;
    var db = req.db;
    var businesses = db.get('businesses');

    var result;

    // retrieve and display the business data to admin dashboard
    async.parallel({

        result: function(cb) {
            businesses.find({}, function (err,results) {
                business = results;
                cb();
            });
        } },

        function(err,results) {

            if(err) { throw err; }

            res.render('business/admindashboard', {
                        eid: employeeId,
                        employeeName: employeename,
                        bid: businessId,
                        message: req.flash("permission"),
                        signed: business
            });
        }
    );
};


