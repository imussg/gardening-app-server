'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Garden = require('../models/garden');
const Plot = require('../models/plot');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {

	{ gardenId } = req.query;
});

router.get('/:id', (req, res, next) => {

});

router.post('/', (req, res, next) => {

	const { name, gardenId } = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}
	if(!gardenId) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const newPlot = { name, gardenId };

	Plot.create(newPlot)
		.then(result => {
			res.location(`${req.originalUrl}/${result.id}`)
	        	.status(201)
	        	.json(result);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;