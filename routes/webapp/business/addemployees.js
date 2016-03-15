var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;
var auth = require('../../../lib/auth');

 /**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.get = function(req,res){
	    var database =  req.db;
        var employeeDB = database.get('employees');
        var employee;
        var notemployee;
        var businessID = req.user[0].business.toString();
				console.log("hello get");
        async.parallel({
          employee: function(cb){
            employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){

              if(err) { return next(err);  }
              if(!results) { return next(new Error('Error finding employee'));}

              employeee = results;
              cb();

          });
        },
            // nonemployee: function(cb){
            //     employeeDB.find({registrationToken: {$exists: true}, business: ObjectId(businessID)}, function (err,results){


            //         if (err) { return next(err); }
            //         if(!results) { return next(new Error('Error finding employee'));}

            //              notemployee = results;
            //              cb();
            //     });
            // }
        },

        function(err,results){
					if(err){
            throw err;
          }
          res.render('business/addemployees',{notsigned: notemployee, signed: employeee});
        });
}

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */

exports.post = function(req,res, next) {
    // var parsed = baby.parse(req.body.csvEmployees);
    //    var rows = parsed.data;
    console.log(req.body);
    var database = req.db;
    var employeeDB = database.get('employees');
    var businessID = req.user[0].business;
    //console.log(req.body.fname);

    if(req.body.submit == "delete"){

      console.log("hello delete");
      employeeDB.find({email: req.body.email}, function (err, results) {
          //if (err) { return next(err);  }
        if (results[0] == null) {
          console.log("we are in");
              //var token = randomToken();

          req.flash("employee", "employee is not in the database");
          res.redirect('back');
        }
				else {
          employeeDB.remove({
          	email: req.body.email
          });
          req.flash("employee", "employee deleted");
          res.redirect('back');
        }
      });
    }
		else {
      console.log("hello post");
      employeeDB.find({email: req.body.email}, function (err, results) {
            //if (err) { return next(err);  }
        if (results[0] == null) {
          console.log("we are in");
                //var token = randomToken();
          employeeDB.insert({
                    // business: ObjectId(businessID),
          	business: businessID,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
						password: auth.hashPassword(req.body.password),
                    //registrationToken : token,
						role: req.body.role
          });

					req.flash("employee", "employee is added successfully!");
          res.redirect('back');
        }
				else {
          req.flash("employee", "employee's email address already exists!");
          res.redirect('back');
        }
      });
    }
}

 function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }
