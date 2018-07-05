'use strict';

const mongoose = require('mongoose');

pictureSchema = new mongoose.Schema({
	src: { type: String, required: true },
	alt: { type: String, required: true }
});

pictureSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete: ret._id;
	}
});

module.exports = mongoose.model('Picture', pictureSchema);