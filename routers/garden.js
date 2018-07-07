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
		})
});

module.exports = router;