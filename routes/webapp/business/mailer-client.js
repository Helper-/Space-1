/**
 * Created by michaelchang on 2/25/16.
 */
var settings = require('./mailer-settings');
var client = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.sendSimpleEmail = function(recipient, subject, message) {
    var options =
    {
        service: 'gmail',
        auth: {
            user: settings.user,
            pass: settings.pass
        }
    };

    var transporter = client.createTransport(smtpTransport(options));

    var mailOptions = {
        from: settings.user,
        to: recipient,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};
