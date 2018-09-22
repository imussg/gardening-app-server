'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Garden = require('../models/garden');
const Plot = require('../models/plot');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {
	
	Veggie.find()
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

	Veggie.findById(id)
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		})
})

router.post('/', (req, res, next) => {
	
	const { name, plotId=null, condition, pictureUrl, pictureAlt } = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
	    err.status = 400;
	    return next(err);
	}

	if(!plotId) {
		const err = new Error('Missing `plotId` in request body');
		err.status = 400;
		return next(err);
	}

	const newVeggie = { name, plotId, condition, pictureUrl, pictureAlt };
	let veggieId;

	Veggie.create(newVeggie)
		.then(result => {
			veggieId = result.id;
			return Plot.findById(plotId);
		})
		.then(plot => {
			plot.veggies.push(veggieId);
			return plot.save();
		})
		.then(result => {
			return Veggie.findById(veggieId);
		})
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
	const { name, plotId=null, condition, pictureUrl, pictureAlt } = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
	    err.status = 400;
	    return next(err);
	}

	if(!plotId) {
		const err = new Error('Missing `plotId` in request body');
		err.status = 400;
		return next(err);
	}

	const newVeggie = { id, name, plotId, condition, pictureUrl, pictureAlt };
	
	Veggie.findByIdAndUpdate(id, newVeggie, {new: true})
		.then(result => {
			if(result) {
				res.json(result);
			} else {
				next();
			}
		}).catch(err => {
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

	let plotId;
	Veggie.findById(id)
		.then((veggie) => {
			plotId = veggie.plotId;
			Plot.findById(plotId);
		})
		.then((plot) => {
			const veggies = plot.veggies.filter(veggie => veggie.plotId !== plotId);
			plot.veggies = [...plot.veggies];
			plot.save();
		})
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;