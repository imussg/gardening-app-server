'use strict';
 
const mongoose = require('mongoose');

const gardenSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
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

gardenSchema.methods.serialize = function() {
	return {
		id: this.id,
		name: this.name || '',
		plots: [...this.plots] || []
	};
}

module.exports = mongoose.model('Garden', gardenSchema);