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

	searchTerm ? Veggie.find({ name: searchTerm }) : Veggie.find()
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
	
	const { name, plotId } = req.body;

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

	const newVeggie = { name, plotId };

	Veggie.create(newVeggie)
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