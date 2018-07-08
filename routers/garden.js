'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Garden = require('../models/garden');
const Plot = require('../models/plot');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {
	const { searchTerm } = req.query;
	if(searchTerm) {
		searchTerm = searchTerm.trim().toLowerCase();
	}

	searchTerm ? Garden.find({ name: searchTerm }) : Garden.find()
		.populate('plots')
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
		.populate('plots')
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

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

	const { id } = req.body;
	const { name, plots = [] } = req.body;

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