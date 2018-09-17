'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Plot = require('../models/plot');
const Garden = require('../models/garden');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {

	return Garden.find()
		.populate('plots')
		.sort({ updatedAt: 'desc' })
		.then(results => {
			console.log(results);
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.get('/:id', (req, res, next) => {

	const id = req.params.id;
	console.log(`id: ${id}`);

	if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		res.status(422).json({
	        code: 422,
	        reason: 'ValidationError',
	        message: `Missing field: ${id}`,
			location: id
		});
  	}

	Garden.findById(id)
		.populate({
			path: 'plots',
			model: 'Plot',
			populate: {
				path: 'veggies',
				model: 'Veggie'
			}
		})
		.sort({ updatedAt: 'desc' })
		.then(garden => {
			console.log(garden);
			res.json(garden);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', (req, res, next) => {
	
	const { name, plots } = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
	    err.status = 400;
	    return next(err);
	}

	const newGarden = {
		name,
		plots: [...plots]};

	Garden.create(newGarden)
		.then(result => {
			res.location(`${req.originalUrl}/${result.id}`)
	        	.status(201)
	        	.json(result);
		})
		.catch(err => {
			next(err);
		});
});

router.put('/:id', (req, res, next) => {

	const { id } = req.params;
	const { name, plots=[] } = req.body;

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

	if (plots) {
	    const badIds = plots.map((plot) => !mongoose.Types.ObjectId.isValid(plot));
	    if (badIds.length) {
			const err = new Error('The tags `id` is not valid');
			err.status = 400;
			return next(err);
	    }
	}

	const newGarden = { name, plots };
	Garden.findByIdAndUpdate(id, newGarden, { new: true })
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

	if (!mongoose.Types.ObjectId.isValid(id)) {
	    const err = new Error('The `id` is not valid');
	    err.status = 400;
	    return next(err);
	}

	Garden.findByIdAndRemove(id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;