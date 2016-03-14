var fs = require('fs');
var auth = require('../../../lib/auth');
var style = require('../../../lib/auth');

exports.get = function (req, res, next) {

   var businessDB = req.db.get('businesses');
   var businessID = req.user[0].business;
     //Get the logo and default BG for the business of the currently logged in user

   businessDB.findById(req.user[0].business, function (err, business) {
     if (err) {
       return next(err);
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
      if(results.logo !== '/images/uploads/defaultLogo.png') {
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
      if(results.bg !== '/images/uploads/defaultBg.jpg') {
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
};
