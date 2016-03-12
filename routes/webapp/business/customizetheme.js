var fs = require('fs');
var auth = require('../../../lib/auth');
var style = require('../../../lib/auth');

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

 exports.post = function(req, res, next){

     var db = req.db;
     var businesses = db.get('businesses');
     var businessID = req.user[0].business;

     if(req.files.userLogo){

         businesses.findById(businessID,
             function (err, results){

                 if(err){
                     return next(err);
                 }

                 fs.unlink('public'+results.logo);
             }
         );

         businesses.updateById(businessID, {
                 $set: {
                     logo: '/images/uploads/' + req.files.userLogo.name
                 }
             },{
                 upsert: true
             }, function (err){
                 if (err) {
                     return next(err);
                 }

                 res.render('business/customizetheme',{
                     success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                     logo:'/images/uploads/'+req.files.userLogo.name
                 });

             }

         );
     }
     else{

         businesses.findById(businessID,
             function (err, results){
                 if(err){
                     return next(err);
                 }

                 if(results.logo){

                     res.render('business/customizetheme',{
                         title:'Upload Logo',
                         logo:results.logo,
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
         );
     }

 };
