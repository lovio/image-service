require('babel-register');
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || 3001;

const exit = process.exit;
process.exit = () => setTimeout(() => exit(), 200);

require('../bin/server.js');
require('../node_modules/mocha/bin/_mocha');
