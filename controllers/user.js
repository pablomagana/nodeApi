"use strict";

var bcrypt = require("bcrypt-nodejs");
var UserModel = require("../models/user");
var jwt = require("../services/jwt");

function pruebas(req, res) {
	res.status(200).send({
		message: "probando controlador"
	});
}

function saveUser(req, res) {
	var user = new UserModel();
	var params = req.body;
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = "ROLE_ADMIN";
	user.image = "null";

	if (params.password) {
		bcrypt.hash(params.password, null, null, function(err, hash) {
			user.password = hash;
			if (user.name != null && user.surname != null && user.email != null) {
				user.save((err, userStored) => {
					if (err) {
						res
							.status(200)
							.send({ message: "Error. unknow error to save user" });
					} else {
						if (!userStored) {
							res
								.status(200)
								.send({ message: "Error. user no save correctly" });
						} else {
							res.status(200).send({ data: userStored });
						}
					}
				});
			} else {
				res.status(200).send({ message: "Error. empty fields" });
			}
		});
	} else {
		res.status(200).send({ message: "Error. No password detected" });
	}
}

function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	UserModel.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err) {
			res.status(500).send({ message: "error. not valid req" });
		} else {
			if (!user) {
				res.status(404).send({ message: "User not exist" });
			} else {
				bcrypt.compare(password, user.password, (err, check) => {
					if (err) {
						res.status(500).send({ message: "error. not valid req" });
					} else {
						if (check) {
							if (params.gethash) {
								var token = jwt.createToken(user);
								res.status(200).send({ token });
							} else {
								res.status(200).send({ user });
							}
						} else {
							res.status(404).send({ message: "User not logged correctly" });
						}
					}
				});
			}
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser
};
