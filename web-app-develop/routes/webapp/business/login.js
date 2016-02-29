//var slackClient = require('../../../slack-client');

exports.get = function(req, res) {
	req.logout();
    res.render('business/login.hjs',{ message: req.flash("login")});
    //slackClient.sendSlackMessage();
};


