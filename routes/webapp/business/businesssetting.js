var auth = require ('../../../lib/auth');
var ObjectId = require('mongodb').ObjectID;

/**
 * Takes an req parameter and res parameter and returns the details of the user's
 * business in company settings
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The businesses's name and their phone number
 */
exports.get = function (req,res) {

    var bid = req.user[0].business.toString();
    var db = req.db;
    var businesses = db.get('businesses');

    // find the business's data
    businesses.find({_id: ObjectId(bid)}, function (err, result) {

        if (err) { return next(err); }

        var phone = result[0].phone;

        phone = phone.replace('1', '');
        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);

        res.render('business/businesssetting', {
            companyName: result[0].companyName,
            phone: phone
        });
    });
};

/**
 * Takes an req parameter and res parameter and allows the user to update
 * their company and phone number displayed
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The businesses's newly updated name and their phone number
 */
exports.post = function (req, res) {

    var db = req.db;
    var businesses = db.get('businesses');
    var bid = req.user[0].business;
    var companyName = req.body.companyName;
    var phone = req.body.phone;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

    // find the business in the database
    businesses.findById(bid, function (err, result) {

        if (err) { return next(err); }

        var dbBusiness = result;
        var dbPassword = result.password;

        //checks and makes sure to only perform a name and phone update
        if(phone  && companyName) {

            //if input fields are empty
            if (companyName === '' || phone === '') {
                phone = dbBusiness.phone;
                //removing country code 1 from phone
                phone = phone.replace('1', '');
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);

                // tells user that this is bad input, retrieve the current name and phone
                res.render('business/businesssetting', {
                    error: 'You must fill in all fields.',
                    companyName: dbBusiness.companyName,
                    phone: phone
                });
            }

            // valid company and phone number inputs
            else {

                // replaces all instances of an input dash with empty character
                phone = phone.replace(/-/g, '');

                if(phone.length === 10) {

                    phone = '1'+phone; // US country code

                    // writes to the database the changed information
                    businesses.update({_id:bid}, {
                        $set :{
                            companyName: companyName,
                            phone: phone
                        }
                    });

                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);

                    // tells user the change is complete
                    res.render('business/businesssetting', {
                        companyName: companyName,
                        phone: phone,
                        edited: 'change successfully done.'
                    });
                }

                // invalid phone number format (should use 1 xxx-xxx-xxxx)
                else{

                    // puts back the original phone number back into text field
                    phone = dbBusiness.phone;
                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);

                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        error: 'phone number should be in 1 xxx-xxx-xxxx format'
                    });
                }
            }
        }

        //performs only if password submit is pressed
        else if (oldPassword && newPassword && confirmPassword) {

            var boolPsw = auth.validPassword(dbPassword, oldPassword);

            // updates business password
            if (boolPsw && newPassword === confirmPassword) {

                newPassword = auth.hashPassword(newPassword);
                businesses.update({_id:bid}, {
                    $set :{
                        password: newPassword
                    }
                });

                phone = dbBusiness.phone;
                phone = phone.replace('1', '');
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    companyName: dbBusiness.companyName,
                    phone: phone,
                    edited: 'password successfully changed.'
                });
            }

            // new password and confirm password do not match
            else {

                phone = dbBusiness.phone;
                phone = phone.replace('1', '');
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    companyName: dbBusiness.companyName,
                    phone: phone,
                    error: 'password does not match'
                });
            }
        }

        // all fields do not contain anything
        else {

            phone = dbBusiness.phone;
            phone = phone.replace('1', '');
            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);

            res.render('business/businesssetting', {
                error: 'You must fill in all fields.',
                companyName: dbBusiness.companyName,
                phone: phone
            });
        }
    });
};
