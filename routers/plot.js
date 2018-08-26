'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Garden = require('../models/garden');
const Plot = require('../models/plot');
const Veggie = require('../models/veggie');

const router = express.Router();

router.get('/', (req, res, next) => {
<<<<<<< HEAD

	Plot.find()
		.populate('veggies')
		.sort({ updatedAt: 'desc' })
=======
	const { gardenId } = req.query;
	
	gardenId ? Plot.find({gardenId: gardenId}) : Plot.find()
		.populate('veggies')
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.get('/:id', (req, res, next) => {
<<<<<<< HEAD

=======
	
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
	const { id } = req.params;

	Plot.findById(id)
		.populate('veggies')
<<<<<<< HEAD
		.sort({ updatedAt: 'desc' })
=======
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', (req, res, next) => {

<<<<<<< HEAD
	// console.log(req.body);
	const { name, gardenId=null, veggies=[] } = req.body;
=======
	const { name } = req.body;
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156

	if(!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}
<<<<<<< HEAD
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
=======

	const newPlot = { name };

	Plot.create(newPlot)
		.then(result => {
			res.location(`${req.originalUrl}/${result.id}`)
				.status(201)
				.json(result);
		})
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
		.catch(err => {
			next(err);
		});
});

router.put('/:id', (req, res, next) => {

<<<<<<< HEAD
	console.log(req.body);
	const { id } = req.params;
	const { name, gardenId=null, veggies=[] } = req.body;
=======
	const { id } = req.params;
	const { name, gardenId, veggies = [] } = req.body;
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156

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

<<<<<<< HEAD
	const newPlot = {
		name
	};
	Plot.findByIdAndUpdate(id, newPlot, {new: true})
=======
	if (veggies) {
	    const badIds = plots.map((plot) => !mongoose.Types.ObjectId.isValid(plot));
	    if (badIds.length) {
			const err = new Error('The tags `id` is not valid');
			err.status = 400;
			return next(err);
	    }
	}

	if (!mongoose.Types.ObjectId.isValid(gardenId)) {
		const err = new Error('The `gardenId` is not valid');
		err.status = 400;
		return next(err);
	}

	const newPlot = { name, gardenId, veggies };
	Plot.findByIdAndUpdate(id, newPlot, { new: true })
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
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
<<<<<<< HEAD

	if(!mongoose.Types.ObjectId.isValid(id)) {
		const err = new Error('The `id` is not valid');
		err.status = 400;
		return next(err);
=======
	if (!mongoose.Types.ObjectId.isValid(id)) {
	    const err = new Error('The `id` is not valid');
	    err.status = 400;
	    return next(err);
>>>>>>> 718dc2ee5bcb90377ccbd1fe9f2529f920a64156
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