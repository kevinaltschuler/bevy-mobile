var user = {};

exports.setUser = function(tempUser) {
	user = tempUser;
};

exports.getUser = function() {
	return user;
};