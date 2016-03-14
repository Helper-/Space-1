var style = require('./../../../lib/style.js');
var slackClient = require('../business/slack-client');
var mailerClient = require('../business/mailer-client');
var twilioClient = require('../business/twilio-client');

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
            var messageBody = req.session.patientFirstName + ' ' + req.session.patientLastName + ' has checked in!';
            mailerClient.sendSimpleEmail('michael.chang25@gmail.com', 'New Checkin!', messageBody);
            twilioClient.sendSmsToPhoneNumber('+16508623873', messageBody);
            slackClient.sendSlackMessage('#messages', 'Receptionist Administrator', messageBody);
            res.redirect('done');
        });
    }
};
