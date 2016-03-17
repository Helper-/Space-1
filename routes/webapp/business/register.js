/**
 * Sends user to the register page
 *
 * @param req and res The two parameters passed in to get session
 * @returns The register for company page
 */
exports.get = function (req, res) {
	if (!req.session.companyName) {
        res.render('business/register');
    } else {
        res.render('business/register', {title: 'Express', companyName: req.session.companyName});
    }
};
