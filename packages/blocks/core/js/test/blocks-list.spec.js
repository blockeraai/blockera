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

['WordPress'].forEach((product) => {
	switch (product) {
		case 'WordPress':
			var blocks = wordpressBlocks;
			break;
	}

	describe(`Validate ${product} Blocks JSON`, () => {
		test('Validate file with schema', () => {
			const validate = ajv.compile(schema);
			const valid = validate(blocks);

			// show log for debug
			if (!valid) console.log(validate.errors);

			expect(true).toBe(valid);
		});

		test('Total blocks to be equal with sum of all blocks', () => {
			const total = blocks.data.total;

			let itemsCount = 0;

			if (typeof blocks.supported !== 'undefined') {
				itemsCount += blocks.supported.length;
			}

			if (typeof blocks['not-supported'] !== 'undefined') {
				itemsCount += blocks['not-supported'].length;
			}

			if (typeof blocks['no-need-to-support'] !== 'undefined') {
				itemsCount += blocks['no-need-to-support'].length;
			}

			expect(itemsCount).toBe(total);
		});

		test('Supported blocks count', () => {
			const total = blocks.data['supported'];

			let itemsCount = 0;

			if (typeof blocks.supported !== 'undefined') {
				itemsCount += blocks.supported.length;
			}

			expect(itemsCount).toBe(total);
		});

		test('Soft supported blocks count (supported + no need to support)', () => {
			const total = blocks.data['soft-supported'];

			let itemsCount = 0;

			if (typeof blocks.supported !== 'undefined') {
				itemsCount += blocks.supported.length;
			}

			if (typeof blocks['no-need-to-support'] !== 'undefined') {
				itemsCount += blocks['no-need-to-support'].length;
			}

			expect(itemsCount).toBe(total);
		});

		test('Not supported blocks count', () => {
			const total = blocks.data['not-supported'];

			let itemsCount = 0;

			if (typeof blocks['not-supported'] !== 'undefined') {
				itemsCount += blocks['not-supported'].length;
			}

			expect(itemsCount).toBe(total);
		});

		test('No need to support blocks count', () => {
			const total = blocks.data['no-need-to-support'];

			let itemsCount = 0;

			if (typeof blocks['no-need-to-support'] !== 'undefined') {
				itemsCount += blocks['no-need-to-support'].length;
			}

			expect(itemsCount).toBe(total);
		});
	});
});
