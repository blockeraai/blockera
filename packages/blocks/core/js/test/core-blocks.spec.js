/**
 * External dependencies
 */
import Ajv from 'ajv';

/**
 * Internal dependencies
 */
import schema from '../schemas/blocks.schema.json';
import wordpressBlocks from '../wordpress-blocks-list.json';

const ajv = new Ajv();

describe('Validate WordPress Core Blocks JSON', () => {
	test('Validate file with schema', () => {
		const validate = ajv.compile(schema);
		const valid = validate(wordpressBlocks);

		// show log for debug
		if (!valid) console.log(validate.errors);

		expect(true).toBe(valid);
	});

	test('Total blocks to be equal with sum of all blocks', () => {
		const total = wordpressBlocks.data.total;

		let itemsCount = 0;

		if (typeof wordpressBlocks.supported !== 'undefined') {
			itemsCount += wordpressBlocks.supported.length;
		}

		if (typeof wordpressBlocks['not-supported'] !== 'undefined') {
			itemsCount += wordpressBlocks['not-supported'].length;
		}

		if (typeof wordpressBlocks['no-need-to-support'] !== 'undefined') {
			itemsCount += wordpressBlocks['no-need-to-support'].length;
		}

		expect(itemsCount).toBe(total);
	});

	test('Supported blocks count', () => {
		const total = wordpressBlocks.data['supported'];

		let itemsCount = 0;

		if (typeof wordpressBlocks.supported !== 'undefined') {
			itemsCount += wordpressBlocks.supported.length;
		}

		expect(itemsCount).toBe(total);
	});

	test('Soft supported blocks count (supported + no need to support)', () => {
		const total = wordpressBlocks.data['soft-supported'];

		let itemsCount = 0;

		if (typeof wordpressBlocks.supported !== 'undefined') {
			itemsCount += wordpressBlocks.supported.length;
		}

		if (typeof wordpressBlocks['no-need-to-support'] !== 'undefined') {
			itemsCount += wordpressBlocks['no-need-to-support'].length;
		}

		expect(itemsCount).toBe(total);
	});

	test('Not supported blocks count', () => {
		const total = wordpressBlocks.data['not-supported'];

		let itemsCount = 0;

		if (typeof wordpressBlocks['not-supported'] !== 'undefined') {
			itemsCount += wordpressBlocks['not-supported'].length;
		}

		expect(itemsCount).toBe(total);
	});

	test('No need to support blocks count', () => {
		const total = wordpressBlocks.data['no-need-to-support'];

		let itemsCount = 0;

		if (typeof wordpressBlocks['no-need-to-support'] !== 'undefined') {
			itemsCount += wordpressBlocks['no-need-to-support'].length;
		}

		expect(itemsCount).toBe(total);
	});
});
