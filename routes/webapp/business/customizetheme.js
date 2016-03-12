var fs = require('fs');
var auth = require('../../../lib/auth');
var style = require('../../../lib/auth');

 exports.get = function (req, res, next) {
   var db = req.db;
   var businesses = db.get('businesses');
   var businessID = req.user[0].business;
     //Get the logo and default BG for the business of the currently logged in user
     businesses.findById(businessID, function (err, business) {
         if (err) { return next(err); }
         if (!business) { return next(new Error('Business not found for user: ' + req.user)); }

         //Show images on the screen
         res.render('business/customizetheme', {
             message: req.flash('permission'),
             logo: business.logo,
             bg: '/images/bg/full/' + business.style.bg
         });
     }); //Closes findByID
 };

 exports.post = function(req, res, next){
     var db = req.db;
     var businesses = db.get('businesses');
     var businessID = req.user[0].business;

     if(req.files.userLogo){
         businesses.findById(businessID, function (err, results) {
                 if(err) { return next(err); }
                 fs.unlink('public'+results.logo);
             }
         ); //Closes findByID

         businesses.updateById(businessID, {
                 $set: {
                     logo: '/images/uploads/' + req.files.userLogo.name,
                 }
             },
              { upsert: true },
              function (err) {
                 if (err) { return next(err); }

                 res.render('business/customizetheme',{
                     success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                     logo:'/images/uploads/'+req.files.userLogo.name
                 });
             }
         ); //Closes updateByID
     }
     else{
         businesses.findById(businessID, function (err, results) {
                 if(err) { return next(err); }
                 if(results.logo) {
                     res.render('business/customizetheme',{
                         title:'Upload Logo',
                         logo:results.logo,
                         bg: '/images/bg/full/' + results.style.bg,
                         error:'Please select a valid image(png,jpg) file to upload.'
                     });
                 }
                 else{
                     res.render('business/customizetheme',{
                         title:'Upload Logo',
                         error:'Please select a valid image(png,jpg) file to upload.'
                     });
                 }
             }
         ); //Closes findByID
     }

 };
