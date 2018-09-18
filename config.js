'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://dev:devdev1@ds119422.mlab.com:19422/gardening-app',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/gardening-app-test'
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
