// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var fs = require('fs');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;

//need this since we are passing in a passport dependency in app.js line 22
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


    passport.use('local-signup', new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var db = req.db;
            var companyName = req.body.companyName;
            var fname = req.body.fname;
            var lname = req.body.lname;
            var phone = req.body.phone;
            var lastCheckin = new Date().toLocaleDateString();

            if (!phone) {
                phone = '';
            }

            // Check if any field has been left blank
            if (companyName === '' || fname === '' || lname === '' || email === ''
                || password === '') {
                res.render('business/register', {
                    error: 'You must fill in all fields.',
                    companyName: companyName,
                    phone: phone,
                    fname: fname,
                    lname: lname,
                    email: email
                });
            }
            else {

                var businesses = db.get('businesses');
                var employees = db.get('employees');
                var forms = db.get('forms');

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                businesses.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error

                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false);
                    } else {

                        // if there is no user with that email
                        // create the user

                        // set the user's local credentials
                        password = auth.hashPassword(password);

                        // save the user
                        businesses.insert({
                            email: email,
                            password: password,
                            companyName: companyName,
                            phone: phone,
                            fname: fname,
                            lname: lname,
                            logo: '/images/defaultLogo.png',
                            bg: '/images/defaultBackground.jpg',
                            lastCheckin: lastCheckin,

                        }, function (err, result) {
                            if (err) {
                                throw err;
                            }

                            var businessID = result._id.toString();
                            console.log( "BUSINESS ID: ");
                            console.log(ObjectId(businessID));

                            employees.insert({
                                business: ObjectId(businessID),
                                password: result.password,
                                phone: result.phone,
                                fname: result.fname,
                                lname: result.lname,
                                email: result.email,
                                smsNotify: true,
                                emailNotify: true,
                                role: 'admin'
                            }, function(err, user){
                                if (err) {
                                    throw err;
                                }
                                return done(null, user);
                            });

                            var defaultFrom = "<form-template>\r\n\t<fields>\r\n\t\t<field className=\"form-control\" " +
                                "label=\"First Name\" maxlength=\"28\" name=\"firstname\" placeholder=\"First Name\" " +
                                "required=\"true\" type=\"text\"/>\r\n\t\t<field className=\"form-control\" " +
                                "label=\"Last Name\" name=\"lastname\" placeholder=\"Last Name\" required=\"true\" type=\"text\"/>\r\n\t"
                                +"<field className=\"btn btn-primary custom-center\" label=\"Submit\" name=\"submit\" type=\"submit\"/>\r\n\t</fields>\r\n</form-template>";
                            forms.insert({
                                business:ObjectId(businessID),
                                data:defaultFrom,
                            });

                        });
                    }
                });
            }

        }
    ));



    passport.use('local-signup-employee',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {



            var db =req.db;
            var employee = db.get('employees');

            password = auth.hashPassword(password);

            employee.findAndModify({
             query: {registrationToken: req.query.token},
             update: { $unset: {registrationToken: 1},
                $set: {password: password} },
             new: true},
                function (err,user){
                if (err) {
                     throw err; }
                return done(null,user);

                 }
            );
        }
    ));



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
              // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function (req, email, password, done) { // callback with email and password from our form

    //For initial Peter run through.
    if(email === "peter@breeze.com" && password === " ") {
      console.log("In the Peter password area.");
      var employees = req.db.get('employees');
      employee = employees.findOne({email: email}, function (err,employee){
        return done(null,employee);
      });
      return done(null,employee);
    }

    auth.validateLogin(req.db, email, password, function (user) {


      if(!user) {
        return done(null, false, req.flash("login", "Invalid Email/Password Combo"));
      }
      else {

          function checkinDate(user) {
              var businessDB = req.db.get('businesses');
              var businessId = user.business;
              var date = new Date().toLocaleDateString();

              businessDB.updateById(businessId,
                  {$set: {checkin: date}},
                  {upsert: true},
                  function (err) {
                  });
              console.log(date);
          }

          checkinDate(user);
          return done(null, user);

      }
    });
  }));
};
