var fs = require('fs');
var auth = require('../../../lib/auth');
var style = require('../../../lib/auth');

<<<<<<< HEAD
exports.get = function (req, res, next) {

   var businessDB = req.db.get('businesses');
=======
 exports.get = function (req, res, next) {
   var db = req.db;
   var businesses = db.get('businesses');
>>>>>>> d50b073d1d2640d7fc35c41c775bf0d31bd404a4
   var businessID = req.user[0].business;
     //Get the logo and default BG for the business of the currently logged in user
     businesses.findById(businessID, function (err, business) {
         if (err) { return next(err); }
         if (!business) { return next(new Error('Business not found for user: ' + req.user)); }

<<<<<<< HEAD
   //Get the logo for the business of the currently logged in user
   businessDB.findById(req.user[0].business, function (err, business) {
     if (err) {
       return next(err);
=======
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
>>>>>>> d50b073d1d2640d7fc35c41c775bf0d31bd404a4
     }

     res.render('business/customizetheme', {
       message: req.flash('permission'),
       logo: business.logo,
       bg: business.bg
     });
   });
};

exports.post = function(req, res, next){

  var businessDB = req.db.get('businesses');
  var businessID = req.user[0].business;

  var stuff;

  if(req.files.userLogo) {
    businessDB.findById(businessID, function (err, results) {

      if(err) {
        return next(err);
      }
      if(results.logo) {
        fs.unlink('public' + results.logo);
      }
      stuff = results.bg
    });

    businessDB.updateById(businessID, {
      $set: {
        logo: '/images/uploads/' + req.files.userLogo.name
      }},
      { upsert: true },
      function(err) {
        console.log("Inserted Logo: " + "\n User Logo: " + req.files.userLogo.name);
        res.render('business/customizetheme', {
          success:'Succesfully uploaded file: ' + req.files.userLogo.name,
          logo:'/images/uploads/' + req.files.userLogo.name,
          bg: stuff
        });
      });
  }

  if(req.files.userBG) {
    businessDB.findById(businessID, function (err, results) {

      if(err) {
        return next(err);
      }
      if(results.bg) {
        fs.unlinkSync('public' + results.bg);
      }
      stuff = results.logo
    });

    businessDB.updateById(businessID, {
      $set: {
        bg: '/images/uploads/' + req.files.userBG.name,
      }},
      { upsert: true },
      function(err, results) {
        console.log("Inserted BG: " + "\n User BG: " + req.files.userBG.name);
        res.render('business/customizetheme', {

          success:'Succesfully uploaded file: ' + req.files.userBG.name,
          bg:'/images/uploads/' + req.files.userBG.name,
          logo: stuff
        });
      });
  }
/**
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


     var query = ({
        query: {business: businessID},
        update: {$set: {
          logo: '/images/uploads' + req.files.userLogo.name,
          name: 'companyLogo'}},
        upsert: true
      })



**/
 };
