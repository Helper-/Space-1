var express = require('express');
var router = express.Router();


//Define the controllers for checkin process
var landing = require('./landing');
var theming = require('./theming');
var login = require('./login');
var formbuilder = require('./formbuilder');
var accountSettings = require('./accountsettings');
var uploadLogo = require('./uploadlogo');
var register = require('./register');
var dashboard = require('./dashboard');
var addappointment = require('./add-appointment');
var addEmployees = require('./addemployees');
var employeeRegister = require('./employeeregister');
var customizeTheme = require('./customizetheme');
var manageForms = require('./manageforms');
var businesssetting = require('./businesssetting');
var setdisclosure = require('./setdisclosure');
module.exports = function (passport) {


    //Pass in passport

    //Setup the routes
    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/theming', isLoggedInBusiness, theming.get);

    router.get('/login', login.get);
    router.post('/login', passport.authenticate('local-login', {
      successRedirect : '/dashboard',
      failureRedirect : '/login',
      failureFlash: true,
    }));

    router.get('/formbuilder', isLoggedIn, formbuilder.get);
    router.post('/formbuilder', isLoggedIn, formbuilder.post);

    router.get('/accountSettings', isLoggedIn, accountSettings.get);
    router.post('/accountSettings', isLoggedIn, accountSettings.post);

    router.get('/businesssetting', isLoggedInBusiness, businesssetting.get);
    router.post('/businesssetting', isLoggedInBusiness,businesssetting.post);


    router.get('/uploadlogo', isLoggedInBusiness, uploadLogo.get);
    router.post('/uploadlogo', isLoggedInBusiness, uploadLogo.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/dashboard', isLoggedIn, dashboard.get);
    //router.post('/dashboard', isLoggedIn, addappointment.post);

    router.get('/add-appointment', isLoggedIn, addappointment.get);
    router.post('/add-appointment', isLoggedIn, addappointment.post);

    router.get('/addemployees',isLoggedInBusiness, addEmployees.get);
    router.post('/addemployees',isLoggedInBusiness, addEmployees.post);

    router.get('/customizetheme', isLoggedIn, customizeTheme.get);
    router.post('/customizetheme', isLoggedIn, customizeTheme.post);

    router.get('/manageforms', isLoggedInBusiness, manageForms.get);

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', passport.authenticate('local-signup-employee',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/setdisclosure', isLoggedInBusiness, setdisclosure.get);
    router.post('/setdisclosure', isLoggedInBusiness, setdisclosure.post);

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}

// route middleware to make sure a user is logged in
function isLoggedInBusiness(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()&& (req.user[0].role === 'admin')){
        return next();
    }
    req.flash("permission", "You do not have permission to access that page");
    // if they aren't redirect them to the home page
    res.redirect('back');
}

    return router;
};
