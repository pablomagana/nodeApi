"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta_secreta";

exports.ensureAuth = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({ message: "Token not detected" });
	}

	var token = req.headers.authorization.replace(/['"]+/g, "").split(" ")[1];

	try {
		var payload = jwt.decode(token, secret);
		if (payload.exp <= moment().unix()) {
			return res.status(404).send({ message: "token expired" });
		}
	} catch (err) {
		return res.status(404).send({ message: "token not valid" });
	}

	req.user = payload;

	next();
};
