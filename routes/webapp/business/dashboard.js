var auth = require('../../../lib/auth');

exports.get = function (req, res) {
	var employees = req.db.get('employees');
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;
	var businessId = req.user[0].business;
	var role = req.user[0].role;

	var businesses = req.db.get('businesses').find();

   businesses.then(function(doc){
		 console.log(doc);
		 next();
	 },{
		 function(err){

		 }
	 });


	if(role === 'admin' || role === 'receptionist' || role === 'employee' || role === 'SuperAdmin') {
	  res.render('business/dashboard', {
	    eid: employeeId,
			employeeName: employeename,
			bid: businessId,
			//biz: biz.companyName,
			message: req.flash("permission"),
		});
	}

	if(role === 'checkin') {
		var businessId = req.user[0].business;
    console.log(businessId);
    var business = req.user[0].business;

		res.redirect('/office/checkin');
//		res.render('checkin/checkin', {
//        companyName: business.companyName,
//        bg: business.bg,
//        logo: business.logo,
//    });
	}

};
