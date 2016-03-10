var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

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

        async.parallel({
            employee: function(cb){
                employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){

                    if (err) { return next(err);  }
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
            res.render('business/addemployees',{title: 'Express',notsigned: notemployee, signed: employeee});

        });
}

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.post = function(req,res,next){
	   // var parsed = baby.parse(req.body.csvEmployees);
    //    var rows = parsed.data;
       var database =  req.db;
       var employeeDB = database.get('employees');
       var businessID = req.user[0].business;
        //console.log(next);
        // if(req.body.id != "delete")
        // {
            employeeDB.find({email: req.body.email },function (err,results){
                //if (err) { return next(err);  }
                if(results[0]==null) {
                    console.log("we are in");
                     //var token = randomToken();
                    employeeDB.insert({
                        // business: ObjectId(businessID),
                        business: businessID,
                        fname: req.body.fname,
                        lname: req.body.lname,
                        email: req.body.email,
                        //registrationToken : token,
                        admin: false
                    });
                    req.flash("employee", "employee is added successfully!");
                    res.redirect('back');
                } else{
                    req.flash("employee", "employee's email address already exists!");
                    res.redirect('back');
                }

            });  
        // } else{
        //     employeeDB.find({email: req.body.email },function (err,results){
        //     //if (err) { return next(err);  }
        //     if(results[0]==null) {
        //         console.log("we are in");
        //          //var token = randomToken();

        //         req.flash("employee", "There is no such employee in the database");
        //         res.redirect('back');
        //     } else{
        //         console.log("we are ready to delete");
        //         employeeDB.remove({
        //             email: req.body.email
        //         })
        //         req.flash("employee", "employee has been deleted!");
        //         res.redirect('back');
        //     }

        //     });


        // }

    }



// exports.delete = function(req, res, next){

//     var database = req.db;
//     var employeeDB = database.get('employees');
//     var businessID = req.user[0].business;

//     employeeDB.find({email: req.body.email },function (err,results){
//         //if (err) { return next(err);  }
//         if(results[0]==null) {
//             console.log("we are in");
//              //var token = randomToken();

//             req.flash("employee", "There is no such employee in the database");
//             res.redirect('back');
//         } else{
//             console.log("we are ready to delete");
//             employeeDB.remove({
//                 email: req.body.email
//             })
//             req.flash("employee", "employee has been deleted!");
//             res.redirect('back');
//         }

//     });

// }




        //   sendgrid.send({
        //     to: email,
        //     from: 'test@localhost',
        //     subject: 'Employee Signup',
        //     text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
        //     'http://robobetty-dev.herokuapp.com/employeeregister?token=' + token
        // }, function (err){
        //     if (err) {
        //         return next(err);
        //     }
        //   });

 function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }
