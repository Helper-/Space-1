var style = require('./../../../lib/style.js');

/**
 * Retrieves the company's current theme
 *
 * @param req and res The two parameters passed in to get business and webpage
 * @returns the company's current web theme
 */
exports.get = function (req, res, next) {
    var bid = req.user[0].business;

    // finds the theme
    req.db.get('businesses').findById(bid, function (err, business) {
        if (err) {
            return next(err);
        }

        // renders the theme
        res.render('business/theme', {
            companyName: business.companyName,
            bg: business.style.bg,
            logo: business.logo,
            style: JSON.stringify(business.style)
        });
    });
};

/**
 * Updates the company's theme with the user's newly
 * inputted theme
 *
 * @param req and res The two parameters passed in to get business and webpage
 * @returns the company's current web theme
 */
exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;


    if(req.files.userLogo) {

        // removes the old business theme
        businesses.findById(businessID,

            function (err, results){

                if(err){
                    return next(err);
                }

                fs.unlink('public'+results.logo);
            }
        );


        // updates the business with the new theme
        businesses.updateById(businessID, {
                $set: {
                    logo: '/images/uploads/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) { return next(err); }

                res.render('business/uploadLogo',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    logo:'/images/uploads/'+req.files.userLogo.name
                });

            }

        );
    }

    // failed attempt at changing business theme
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
