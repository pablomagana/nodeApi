"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var albumSchema = Schema({
	name: String,
	description: String,
	year: Number,
	image: String,
	artist: { type: Schema.Types.ObjectId, ref: "Artist" }
});

module.exports = mongoose.model("Album", AlbumSchema);
