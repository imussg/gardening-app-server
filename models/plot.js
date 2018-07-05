'use strict';

const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
	name: { type: String, required: true },
	veggies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Veggie'}]
});

plotSchema.set('timestamps', true);

plotSchema.set('toObject', {
	vituals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
  	}
});

module.exports = mongoose.model('Plot', plotSchema);