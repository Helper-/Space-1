var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;
var auth = require('../../../lib/auth');

 /**
 * Takes a req and res parameters and is inputted into function
 * to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the appropriate employee,
 * @returns The appropriate data about the employee
 */
exports.get = function(req,res) {

    var database =  req.db;
    var employeeDB = database.get('employees');
    var employee;
    var notemployee;
    var businessID = req.user[0].business.toString();

    async.parallel({

      employee: function(cb) {

        employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},

        function (err,results) {

          if(err) { return next(err); }

          if(!results) { return next(new Error('Error finding employee')); }

          employeee = results;
          cb();

        });
      }
    },

    function(err,results) {

        if(err){ throw err; }
        res.render('business/addemployees',{message: req.flash("employee"),
                    title: 'Express',notsigned: notemployee, signed: employeee});

    });
};

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the appropriate employee,
 * @returns The appropriate data about the employee
 */

exports.post = function(req,res, next) {

    var database = req.db;
    var employeeDB = database.get('employees');
    var businessID = req.user[0].business;

    if(req.body.submit == "delete") {

      employeeDB.find({email: req.body.email}, function (err, results) {

          if (results[0] == null) {

            req.flash("employee", "Employee does not exists.");
            res.redirect('back');
          }

          else {

            employeeDB.remove({email: req.body.email});
            req.flash("employee", "Employee has been deleted.");
            res.redirect('back');
        }
      });
    }

    else {

      employeeDB.find({email: req.body.email}, function (err, results) {

          if (results[0] == null) {

            phone = req.body.phone;

            if(!phone) {
                phone = "";
            }

            employeeDB.insert({
          	    business: businessID,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phone: req.body.phone,
                password: auth.hashPassword(req.body.password),
                role: req.body.role
            });

            req.flash("employee", "Employee has been added successfully!");
            res.redirect('back');
          }

          else {

            req.flash("employee", "Employee's email address already exists!");
            res.redirect('back');
          }
      });
    }
};

function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}
