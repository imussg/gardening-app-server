'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

const Veggie = require('../models/veggie');
const Plot = require('../models/plot');
const Garden = require('../models/garden');

const seedVeggies = require('../db/seed/veggies');
const seedPlots = require('../db/seed/plots');
const seedGardens = require('../db/seed/gardens');

mongoose.connect(DATABASE_URL)
	.then(() => mongoose.connection.db.dropDatabase())
	.then(() => {
		return Promise.all([
			Veggie.insertMany(seedVeggies),
			Plot.insertMany(seedPlots),
			Garden.insertMany(seedGardens)
		]);
	})
	.then(() => mongoose.disconnect())
	.catch(err => {
		console.log(err);
	});