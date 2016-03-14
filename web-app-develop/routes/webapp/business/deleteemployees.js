
/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.post = function(req,res){
       var database =  req.db;
       var employeeDB = database.get('employees');
       var businessID = req.user[0].business;
        

        employeeDB.find({email: req.body.email },function (err,results){
                if(results[0]==null) { 
                    res.send("user doesn't exist");
                } else{
                    employeeDB.remove({
                        email: req.body.email,
                    });
                    res.redirect('/addemployees');
                }

        });

}
