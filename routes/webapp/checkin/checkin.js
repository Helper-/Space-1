var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    //var business = req.session.business;
    var businessId = req.user[0].business;
    var db = req.db;
    var businessDb = db.get('businesses');

    businessDb.find({_id:businessId}, function (err, result) {
        var business = result[0];
        res.render('checkin/checkin', {
            companyName: business.companyName,
            bg: business.bg,
            logo: business.logo,
        });
        req.session.business = business;
        req.session.save(function (err) {
            if (err) {
                console.error('Session save error:', err);
            }
        });
    });

};
