var style = require('./../../../lib/style.js');

exports.get = function(req, res, next) {
    var business = req.session.business;

    //TODO: Verify that there are results and no errors
    res.render('checkin/sign', {
        disclosure: business.disclosure,
        companyName: business.companyName,
        bg: business.bg,
        logo: business.logo,
        buttonBg: style.rgbObjectToCSS(business.buttonBg),
        buttonText: style.rgbObjectToCSS(business.buttonText),
        containerText: style.rgbObjectToCSS(business.containerText),
        containerBg: style.rgbObjectToCSS(business.containerBg)
    });
};

exports.post = function (req, res, next) {
    var sig = req.body.sig.trim();
    if (sig === '') {
        var business = req.session.business;

        res.render('checkin/sign', {
            disclosure: business.disclosure,
            error: 'You must provide a signature',
            companyName: business.companyName,
            bg: business.bg,
            logo: business.logo,
            buttonBg: style.rgbObjectToCSS(business.buttonBg),
            buttonText: style.rgbObjectToCSS(business.buttonText),
            containerText: style.rgbObjectToCSS(business.containerText),
            containerBg: style.rgbObjectToCSS(business.containerBg)
        });
    } else {
        //Update the state of the appointment
        req.db.get('appointments').updateById(req.session.appointmentId, {
            $set: {
                state: 'checkedIn'
            }
        }, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('done');
        });
    }
};
