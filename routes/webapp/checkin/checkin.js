var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    var business = req.session.business;
    res.render('checkin/checkin', {
        companyName: business.companyName,
        bg: business.style.bg,
        logo: business.logo,
    });
};
