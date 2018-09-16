'use strict';

const mongoose = require('mongoose');

const veggieSchema = mongoose.Schema({
	name: { type: String, required: true },
	plotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot'},
	condition: { type: String },
	pictureUrl: { type: String },
	pictureAlt: { type: String }
});

veggieSchema.set('timestamps', true);

veggieSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
});

module.exports = mongoose.model('Veggie', veggieSchema);