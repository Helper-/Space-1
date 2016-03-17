/**
 * Sets up the landing page to the web app in the beginning
 *
 * @param req and res The two parameters passed in to get session
 * @returns The landing page
 */
exports.get = function (req, res, next) {

	req.session.companyName = null;

	req.session.save(function (err) {
        if (err) { return next(err); }
    });

    res.render('business/landing', {title: 'Landing Page'});
};

/**
 * Sends user to the register page if there are no companies with that name
 *
 * @param req and res The two parameters passed in to get session
 * @returns The register for company page
 */
exports.post = function (req, res, next) {

    var companyName = req.body.companyName;

    if (companyName === '') {
        res.redirect('/register');
    }

    else {
        req.session.companyName = companyName;

        req.session.save(function (err) {

            if (err) { return next(err); }

            res.redirect('/register');
        });
    }
};
