var express = require('express');
var router = express.Router();

//Define the controllers for checkin process
var checkin = require('./checkin');
var nocode = require('./nocode');
var apptinfo = require('./apptinfo');
var customform = require('./customform');
var sign = require('./sign');
var done = require('./done');

//Setup the routes
router.get('/checkin', updateBusiness, checkin.get);
router.post('/checkin', updateBusiness, checkin.post);

router.get('/nocode', updateBusiness, nocode.get);
router.post('/nocode', updateBusiness, nocode.post);

router.get('/apptinfo', updateBusiness, apptinfo.get);

router.get('/customform', updateBusiness, customform.get);
router.post('/customform', updateBusiness, customform.post);

router.get('/sign', updateBusiness, sign.get);
router.post('/sign', updateBusiness, sign.post);

router.get('/done', updateBusiness, done.get);

module.exports = router;

/**
 * Middleware to ensure that req.session.business contains info about the current business
 */
function updateBusiness(req, res, next) {
    console.log("USER : " + req.user[0]);
  var businessId = req.user[0].business;
  console.log("Going in updateBusiness");
  console.log(businessId);
    //Simple case: first time on the page
    if (!req.session.business) {
        req.db.get('businesses').findById(businessId, function (err, business) {
            if (err) {
                return next(err);
            }
            req.session.business = business;
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                next();
            });
        });
    }
//    else if (req.session.business._id !== req.params.id) {
        //This means the business was switched which could be part of a security attack
        //Destroy the session and then get the new business to be safe
//        req.session.destroy(function (err) {
//            if (err) {
//                return next(err);
//            }
//            req.db.get('businesses').findById(req.params.id, function (err, business) {
//                if (err) {
//                    return next(err);
//                }
//                req.session.business = business;
//                req.session.save(function (err) {
//                    if (err) {
//                        return next(err);
//                    }
  //                  next();
  //              });
  //          });
  //      });
//    }
    else { //Everything looks good, do nothing
        next();
    }
}
