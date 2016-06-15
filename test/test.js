describe ("test", function(){
	it("should work", function () {
		expect(true).toBe(true)
	})
})

describe( "Go to login page", function() {

	it("Show the login form", function() {
		var login = ("#login");
		window.location.href = "http://www.space-1.rocks/login"
		expect(true).toBe(true);
	});
	
/*	describe("Fill out the login form", function() {
		
		var email = "a@a.com";
		var pw = "blah";
		
		it("Try to login", function() {
			("#loginemail").val(email);
			
			expect(true).toBe(true);
		});
	});*/
	
	it("Password is incorrect", function() {
		expect(true).toBe(true);
	})

	it("E-mail is incorrect", function() {
		expect(true).toBe(true);
	})
	
});
