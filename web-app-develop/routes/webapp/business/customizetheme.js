/*var fs = require('fs');
var auth = require('../../../lib/auth');

exports.get = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    businesses.findById(businessID,
        function (err, results){
            if(err){
                return next(err);
            }

            if(results.logo){

                res.render('business/customizetheme', {
                  title:'Upload Logo',
                  logo: results.logo
                });
            }
            else{
                res.render('business/customizetheme',
                    {title:'Upload Logo'});
            }

            if(results.style.bg) {
              res.render('business/customizetheme', {
                title: 'Backgroud Image',

              //message: req.flash('permission'),
              //logo2: 'images/bg/thumb/' + results.style.logo,
                bg: '/images/bg/thumb/' + business.style.logo
              });
            }

            else {
              res.render('business/customizetheme', {
              title: 'Backgroud Image' });
            }
      });
} */
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
