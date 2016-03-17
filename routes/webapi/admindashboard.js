

exports.get = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.find(
        function (err, results) {
            if (err) {
                console.error('MongoDB Error in /businesses: ' + err);
                return res.send(500);
            }
            res.json(results);
        });
};
