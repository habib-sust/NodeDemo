//app/models/user.js

const mongoose = require('mongoose'),   // mongoose for create user model
	  bcrypt = require('bcrypt');		// Bcrypt for hash user password


const Schema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	clients: [{}]
});

// We won't use arrow functions here because of automatic lexical scope binding
Schema.pre('save',function(next){
	const user = this;

	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10,(err,salt) => {
			if (err){
				return next(err);
			}

			bcrypt.has(user.password,salt, (err,hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

//compare passwords to check if the login attempt is valid or not:

Schema.methods.comparePassword = function(password,callback){
	bcrypt.compare(password, this.password,(error,matches){
		if (error){
			return callback(error);
		}
		callback(null,matches);
	});
};

//create our User model
mongoose.model('User',Schema);
