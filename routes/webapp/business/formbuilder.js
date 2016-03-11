exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var bId = req.user[0].business;
    var formDB = req.db.get('forms');

    var query = ({
      query: {business: bId},
      update: {$set: {data: formData}},
      upsert: true
    })

    formDB.findAndModify(query, function (err, result) {
      if (err) {
        res.render('business/formbuilder', {title: 'Express', error: 'Error occurred, please try again.'});
        return;
      }

      console.log("Inserted form: " + "\n formData: " + formData + "\n business: " + bId);
      res.render('business/formbuilder', {title: 'Express', error: 'Form successfully saved.'});
    });
};

/**
exports.get = function (req, res, next) {
    var forms = req.db.get('forms');
    var businessID = req.user[0].business;
    forms.findOne({business: businessID}, function (err, form, findID) {
        if (err) {
            return next(err);
        }
        res.render('business/formbuilder', {
            title: 'Express',
            form: form,
            findID: businessID
        });
    });
};
**/
