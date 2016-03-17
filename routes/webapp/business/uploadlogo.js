var fs = require('fs');
var auth = require('../../../lib/auth');

/**
 * Sets up the company upload logo page with the current company logo
 * with the button to upload right next to the image
 *
 * @param req and res The two parameters passed in to get business and webpage
 * @returns the company's current logos
 */
exports.get = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    // find the business's company logo and the
    businesses.findById(businessID,
        function (err, results){
            if(err){
                return next(err);
            }

            // places the buttons to upload right next to the current logos
            if(results.logo){

                res.render('business/uploadLogo',
                    {title:'Upload Logo',logo: results.logo});
            }
            else{
                res.render('business/uploadLogo',
                    {title:'Upload Logo'});
            }
        }
    );

};

/**
 * Updates the company logos with the user's uploaded images
 *
 * @param req and res The two parameters passed in to get business and webpage
 * @returns the company's newly updated logos
 */
exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    // removes the company's old logo
    if(req.files.userLogo) {

        businesses.findById(businessID,
            function (err, results){

                if(err){
                    return next(err);
                }

                fs.unlink('public'+results.logo);
            }
        );

        // upates the companys logo with the uploaded image
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

                res.render('business/uploadLogo',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    logo:'/images/uploads/'+req.files.userLogo.name
                });

            }

        );
    }

    // case where the user does not upload a valid image
    else{

        businesses.findById(businessID,
            function (err, results){
                if(err){
                    return next(err);
                }

                if(results.logo){

                    res.render('business/uploadLogo',{
                        title:'Upload Logo',
                        logo:results.logo,
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
                else{
                    res.render('business/uploadLogo',{
                        title:'Upload Logo',
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
            }
        );
    }

};
