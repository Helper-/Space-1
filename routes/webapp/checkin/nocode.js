var ObjectID = require('mongodb').ObjectID;
var style = require('./../../../lib/style.js');
var _ = require('underscore');


exports.get = function (req, res, next) {
    var businessID = req.session.business._id;
    var forms = req.db.get('forms');
    businessID = ObjectID(businessID + "");

    forms.findOne({business: businessID}, function (err, form_data) {
        if (err) {
            return next(err);
        }
        console.log(form_data);
        if(form_data !== null) {
          res.render('checkin/nocode', {
            message: req.flash('permission'),
            form: form_data.data,
            bg: businessID.bg
          });
        }

        else {
          res.render('checkin/nocode', {
            message: req.flash('permission'),
            form: "You don't have a a form yet.",
            bg: businessID.bg
          });
        }
    });
};

exports.post = function (req, res, next) {
    var db = req.db;

    var appointments = db.get('appointments');
    var businesses = db.get('businesses');

    var business = req.session.business;
    appointments.find(_.extend(_.clone(req.body),{business: ObjectID(business._id)}), function(err, result) {
        console.log('--find was called--');
        if (result.length === 0) {
            console.log('--result was 0--', JSON.stringify(_.extend(_.clone(req.body),{business: ObjectID(req.params.id)})))
            res.json({error: 'No appointment found'});;
        }
        else {
            console.log('appointment found');
            var appt = result[0];
            var apptID = appt._id;
            appointments.find({_id:apptID},function(err,data){
                console.log('--finding by id--')
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
                    res.json({redirect:'/office/checkin'});
                });
            });

        }
    });
};
