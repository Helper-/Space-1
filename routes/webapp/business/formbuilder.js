exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var bId = req.user[0].business;
    var formDB = req.db.get('forms');

    var formNames = req.body['name'];
    if (!formNames)
    {
        res.render('business/formbuilder', {error: 'You need at least a textfield with the name \"firstname\", a textfield' +
                        'with the name \"lastname\" and a button with the name \"submit\" in your form!'});
        return;
    }
    if (formNames.indexOf('submit') < 0)
    {
        console.log("There's no submit button");
        res.render('business/formbuilder', {error: 'There needs to be a button with the name \'submit\' in your form.'});
        return;
    }

    if (formNames.indexOf('firstname') < 0)
    {
        console.log("There's no firstName textfield!");
        res.render('business/formbuilder', {error: 'There needs to be a textfield with the name \'firstname\' in your form.'});
        return;
    }

    if (formNames.indexOf('lastname') < 0)
    {
        console.log("There's no lastName textfield!");
        res.render('business/formbuilder', {error: 'There needs to be a textfield with the name \'lastname\' in your form.'});
        return;
    }


    var query = ({
      query: {business: bId},
      update: {$set: {data: formData}},
      upsert: true
    })

    formDB.findAndModify(query, function (err, result) {
      if(err) {
        res.render('business/formbuilder', {error: 'Error occurred, please try again.'});
        return;
      }
      if(result !== null) {
        console.log("Inserted form: " + "\n formData: " + formData + "\n business: " + bId);
        works: "<script>alert('hi');</script>"
        //res.render('business/formbuilder', {title: 'Express', error: 'Form successfully saved.'});
      }
      else {
        formDB.insert({business: bId, data: formData}, function (err, result) {
          if(err) {
            res.render('business/formbuilder', {error: 'Error occurred, please try again.'});
            return;
          }
          console.log("Inserted form: " + "\n formData: " + formData + "\n business: " + bId);
          //res.render('business/formbuilder', {title: 'Express', error: 'Form successfully saved.'});
        });
      }
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
