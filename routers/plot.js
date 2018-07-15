'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Garden = require('../models/garden');
const Plot = require('../models/plot');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {

	Plot.find()
		.populate('veggies')
		.sort({ updatedAt: 'desc' })
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.get('/:id', (req, res, next) => {

	const { id } = req.params;

	Plot.findById(id)
		.populate('veggies')
		.sort({ updatedAt: 'desc' })
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', (req, res, next) => {

	// console.log(req.body);
	const { name, gardenId=null, veggies=[] } = req.body;

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
	let plotId;

	Plot.create(newPlot)
		.then(result => {
			plotId = result.id;
			return Garden.findOne({ _id: gardenId });
		})
		.then(garden => {
			garden.plots.push(plotId);
			return garden.save();
		})
		.then(result => {
			return Plot.findById(plotId);
		})
		.then(result => {
			res.status(201).json(result);
	    })
		.catch(err => {
			next(err);
		});
});

router.put('/:id', (req, res, next) => {

	console.log(req.body);
	const { id } = req.params;
	const { name, gardenId=null, veggies=[] } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		const err = new Error('The `id` is not valid');
		err.status = 400;
		return next(err);
	}

	if (name === '') {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const newPlot = {
		name
	};
	Plot.findByIdAndUpdate(id, newPlot, {new: true})
		.then(result => {
			if(result) {
				res.json(result);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

router.delete('/:id', (req, res, next) => {

	const { id } = req.params;

	if(!mongoose.Types.ObjectId.isValid(id)) {
		const err = new Error('The `id` is not valid');
		err.status = 400;
		return next(err);
	}

	Plot.findByIdAndRemove(id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;