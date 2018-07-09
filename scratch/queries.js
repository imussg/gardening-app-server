'use strict';

const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

const Veggie = require('../models/veggie');
const Plot = require('../models/plot');
const Garden = require('../models/garden');

mongoose.connect(MONGODB_URI)
	.then(() => {

	})
	.catch(err => )