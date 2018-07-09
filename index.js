'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const gardensRouter = require('./routers/garden');
// const plotsRouter = require('./routers/plot');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());

app.use('/api/gardens', gardensRouter);
app.use('/api/plot', plotsRouter);
// app.use('/api/plots', plotsRouter);

// app.get('/api/cheeses', (req, res) => {
//   res.json([
//       "Bath Blue",
//       "Barkham Blue",
//       "Buxton Blue",
//       "Cheshire Blue",
//       "Devon Blue",
//       "Dorset Blue Vinney",
//       "Dovedale",
//       "Exmoor Blue",
//       "Harbourne Blue",
//       "Lanark Blue",
//       "Lymeswold",
//       "Oxford Blue",
//       "Shropshire Blue",
//       "Stichelton",
//       "Stilton",
//       "Blue Wensleydale",
//       "Yorkshire Blue"
//   ]);
// });

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
