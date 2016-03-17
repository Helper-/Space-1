var style = require('./../../../lib/style.js');
var slackClient = require('../business/slack-client');
var mailerClient = require('../business/mailer-client');
var twilioClient = require('../business/twilio-client');
var _ = require('underscore');

exports.get = function (req, res, next) {
    //var business = req.session.business;
    var businessId = req.user[0].business;
    var db = req.db;
    var businessDb = db.get('businesses');
    var forms = req.db.get('forms');

    businessDb.find({_id:businessId}, function (err, result) {
        var business = result[0];
        //console.log("background: " + business.bg);
        forms.findOne({business: businessId}, function (err, form_data) {
            if (err) {
                return next(err);
            }
            if (form_data) {
                var formHtml = form_data.data;
                req.session.formHtml = formHtml;
                //console.log(formHtml);
                res.render('checkin/checkin', {
                    formHtml: formHtml,
                    companyName: business.companyName,
                    bg: business.bg,
                    logo: business.logo,
                });
            }
            else {
                res.render('checkin/checkin', {
                    companyName: business.companyName,
                    bg: business.bg,
                    logo: business.logo,
                });
            }

        });
        req.session.business = business;
        req.session.save(function (err) {
            if (err) {
                console.error('Session save error:', err);
            }
        });
    });



};

exports.post = function (req, res, next) {
    var db = req.db;

    var appointments = db.get('appointments');
    var businesses = db.get('businesses');
    var businessId = req.user[0].business;

    var business = req.session.business;

    var inputFirst = req.body['fname'];
    var inputLast = req.body['lname'];

    //console.log(req);

    //console.log('input first ' + inputFirst);
    //console.log('input last ' + inputLast);

    appointments.find({business: businessId, fname: inputFirst, lname: inputLast/*, dob: inputDOB*/}, function(err, result) {
        console.log(req.params.id, inputFirst, inputLast/*, inputDOB*/);
        if (result.length === 0) {
            res.render('checkin/checkin', {
                error: 'No appointment found',
                formHtml: req.session.formHtml,
                //inputDOB: inputDOB,
                bg: business.bg,
                logo: business.logo,
            });
            return;

        }
        else {
            var appt = result[0];
            var apptID = appt._id;
            req.session.appointmentId = apptID;

            appointments.find({_id:apptID},function(err,data){
                var myState = {};
                if (data[0].state == 'checkedIn'){
                    myState = _.extend(data[0], {state : "roomed"});
                } else if (data[0].state == 'roomed'){
                    myState = _.extend(data[0], {state : "done"});
                } else {
                    myState = _.extend(data[0], {state : "checkedIn"});
                }

                appointments.findAndModify({_id:apptID }, myState, function(err, data) {
                    if (err) { return res.sendStatus(500, err); }
                });
            });

            //req.session.patientFirstName = inputFirst;
            //req.session.patientLastName = inputLast;
            req.session.save(function (err) {
                if (err) {
                    console.error('Session save error:', err);
                }
                var messageBody = inputFirst + ' ' + inputLast + ' has checked in!';
                mailerClient.sendSimpleEmail('michael.chang25@gmail.com', 'New Checkin!', messageBody);
                twilioClient.sendSmsToPhoneNumber('+16508623873', messageBody);
                slackClient.sendSlackMessage('#messages', 'Receptionist Administrator', messageBody);
                var disclosure = business.disclosure;
                if (disclosure)
                {
                    res.redirect('sign');
                }
                else
                {
                    res.redirect('done');
                }
            });
        }
    });
};
