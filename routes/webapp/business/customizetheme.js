var fs = require('fs');
var auth = require('../../../lib/auth');
var style = require('../../../lib/auth');

/**
 * Takes an req parameter and res parameter and returns the details of the user's
 * business's logo in the customize theme and the default background
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The business's current logo
 */
exports.get = function (req, res, next) {

    var businessDB = req.db.get('businesses');
    var businessID = req.user[0].business;

    businessDB.findById(req.user[0].business, function (err, business) {

        if (err) { return next(err); }

        res.render('business/customizetheme', {
                    message: req.flash('permission'),
                    logo: business.logo,
                    bg: business.bg
        });
    });
};

/**
 * Takes an req parameter and res parameter and asks the user for their own
 * picture to upload if they desire to change the business logo
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The businesses's new logo
 */
exports.post = function(req, res, next){

    var businessDB = req.db.get('businesses');
    var businessID = req.user[0].business;
    var holder;

    // update the company logo
    if(req.files.userLogo) {

        businessDB.findById(businessID, function (err, results) {

            if(err) { return next(err); }

            // remove the old default logo from the database
            if(results.logo !== '/images/defaultLogo.png') {
                fs.unlink('public' + results.logo);
            }

            holder = results.bg
        });

        // update the database's company logo with the new image
        businessDB.updateById(businessID,
            { $set: { logo: '/images/uploads/' + req.files.userLogo.name }},
            { upsert: true },

            function(err) {
                res.render('business/customizetheme', {
                    success:'Succesfully uploaded file: ' + req.files.userLogo.name,
                    logo:'/images/uploads/' + req.files.userLogo.name,
                    bg: holder
                });
            }
        );
    }

    // update the company background
    if(req.files.userBG) {

    businessDB.findById(businessID, function (err, results) {

        if(err) { return next(err); }

        // remove the old default background from the database
        if(results.bg !== '/images/defaultBackground.jpg') {
            fs.unlinkSync('public' + results.bg);
        }

        holder = results.logo
    });

    // update the database's background and show the successful change to user
    businessDB.updateById(businessID,
        { $set: { bg: '/images/uploads/' + req.files.userBG.name, }},
        { upsert: true },

        function(err, results) {
            res.render('business/customizetheme', {
                success:'Succesfully uploaded file: ' + req.files.userBG.name,
                bg:'/images/uploads/' + req.files.userBG.name,
                logo: holder
            });
        });
    }
};
