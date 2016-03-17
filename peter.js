//
//  This script is used to create the Peter role for
//  our Breeze checkin app.
//
//  To run this script you:
//  Need to start our app (gulp)
//  In another terminal window run mongo > peter.js
//  To log in the account is:
//  peter@breeze.com
//  _  <--- that is a space not underscore.
//  Peter starts with his password as a space so Make
//  sure to change it after first login.
//

use breeze
show collections

db.businesses.insert({
  email: "peter@breeze.com",
  password: "",
  companyName: "GhostBusters",
  phone: "(800) 555-2368",
  fname: "Peter",
  lname: "Venkman",
  logo: '/images/defaultLogo.png',
  bg: '/images/defaultBg.jpg',
  lastCheckin: " "
});

db.employees.insert({
	business: "GhostBusters",
  fname: "Peter",
  lname: "Venkman",
  phone: "(800) 555-2368",
  email: "peter@breeze.com",
	password: "",
	role: "SuperAdmin",
  smsNotify: true,
  emailNotify: true
});

exit
