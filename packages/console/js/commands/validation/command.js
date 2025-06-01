/**
 * External dependencies
 */
const path = require('path');

/**
 * Internal dependencies
 */
const Processor = require('./processor');

const filePath = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'..',
	process.argv[2]
);

const processor = new Processor(filePath);
processor.applyRandomRefactor();
