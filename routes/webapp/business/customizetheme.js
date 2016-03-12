var fs = require('fs');
var auth = require('../../../lib/auth');

 exports.get = function (req, res, next) {

   var db = req.db;
   var businesses = db.get('businesses');
   var businessID = req.user[0].business;

     //Get the logo for the business of the currently logged in user
     req.db.get('businesses').findById(req.user[0].business, function (err, business) {
         if (err) {
             return next(err);
         }
         if (!business) {
             return next(new Error('Business not found for user: ' + req.user));
         }

         res.render('business/customizetheme', {
             message: req.flash('permission'),
             logo: business.logo,
             bg: '/images/bg/full/' + business.style.bg
         });
     });
 };
