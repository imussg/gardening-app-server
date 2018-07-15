'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Plot = require('../models/plot');
const Garden = require('../models/garden');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {

	Garden.find()
		.populate({
			path: 'plots',
			populate: {
				path: 'veggies',
				model: 'Veggie'
			}
		})
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

	Garden.findById(id)
		.populate({
			path: 'plots',
			model: 'Plot',
			populate: {
				path: 'veggies',
				model: 'Veggie'
			}
		})
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		})
})

router.post('/', (req, res, next) => {
	
	const { name } = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
	    err.status = 400;
	    return next(err);
	}

	const newGarden = { name };

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

	const newGarden = {
		name
	};
	Garden.findByIdAndUpdate(id, newGarden, {new: true})
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

	Garden.findByIdAndRemove(id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;