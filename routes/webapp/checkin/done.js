var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    var business = req.session.business;

    res.render('checkin/done', {
        companyName: business.companyName,
        bg: business.bg,
        logo: business.logo,
        buttonBg: style.rgbObjectToCSS(business.buttonBg),
        buttonText: style.rgbObjectToCSS(business.buttonText),
        containerText: style.rgbObjectToCSS(business.containerText),
        containerBg: style.rgbObjectToCSS(business.containerBg)
    });
};
