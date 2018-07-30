'use strict';
 
const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
	name: { type: String, required: true },
	plots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plot' }]
});

gardenSchema.set('timestamps', true);

gardenSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
});

module.exports = mongoose.model('Garden', gardenSchema);