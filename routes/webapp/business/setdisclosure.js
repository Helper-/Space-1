var auth = require('../../../lib/auth');
var _ = require('underscore');

/**
 * Gets the disclosure agreement already made beforehand from the database
 *
 * @param req and res The two parameters passed in to get session
 * @returns the disclosure agreement from the database
 */
exports.get = function(req, res) {
	var bid = req.user[0].business;
	var db = req.db;
	var business = db.get('businesses');
	business.find({_id: bid}, function (err, result) {
		var dbBusiness = result[0];
		var disclosure = dbBusiness.disclosure;
        if (!disclosure) {
            disclosure = ">>>>>>>>Add a disclosure agreement here."
        }

		disclosure = disclosure.slice(3);
		disclosure = disclosure.replace(/<p>/g, '\n');
		disclosure = disclosure.replace(/<\/p>/g, '\n');
		//disclosure = _.escape(disclosure);

		res.render('business/setdisclosure', {
			disclosure: _.unescape(disclosure)
		});
	});

};

/**
 * Creates the disclosure agreement and updates the old
 * disclosure agreement
 *
 * @param req and res The two parameters passed in to get session
 * @returns the new disclosure agreement made
 */
exports.post = function(req, res) {
	var bid = req.user[0].business;
	var db = req.db;
	var business = db.get('businesses');
	var disclosure = req.body.disclosure;

    // empty disclosure agreement field error
	if (disclosure.length === 0) {
		res.render('business/setdisclosure', {
			disclosure: req.body.disclosure,
			alert: 'Disclosure field left empty, please fill it in.'
		});
	}

    // creates the new disclosure agreement and saves it
	else
	{
		disclosure = _.escape(disclosure);
		disclosure = disclosure.replace(/\r\n\r\n/g, '</p><p>');
		disclosure = disclosure.replace(/\r\n/g, '</p><p>');
		disclosure = '<p>' + disclosure + '</p>';


		business.findAndModify({_id: bid},{
			$set :{
				disclosure: disclosure
			}
		});

		res.render('business/setdisclosure', {
			disclosure: req.body.disclosure,
			edited: 'Disclosure agreement successfully saved!'
		});
	}
};
