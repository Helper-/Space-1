/**
 * Takes an req parameter and res parameter and displays the register employee
 * page
 *
 * @param req and res The two parameters passed in to get the appropriate businesses
 * @returns The register employee page
 */
exports.get = function(req,res){
    res.render('business/registeremployees');
};



