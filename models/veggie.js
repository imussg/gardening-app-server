'use strict';

const mongoose = require('mongoose');

veggieSchema = new mongoose.Schema({
	name: { type: String, required: true },
	condition: { type: String },
	picture: { type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }
});

veggieSchema.set('timestamps', true);

veggieSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete: ret._id;
	}
});

module.exports = mongoose.model('Veggie', veggieSchema);