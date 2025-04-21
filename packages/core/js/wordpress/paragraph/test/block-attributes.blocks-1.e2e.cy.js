/**
 * Blockera dependencies
 */
import {
	createPost,
	getWPDataObject,
	getBlockType,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Testing shared default attributes value', () => {
	beforeEach(() => {
		createPost();
	});

	it('should valid sets default attributes values', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		getWPDataObject().then((data) => {
			const attributes = getBlockType(data, 'core/paragraph').attributes;

			for (const name in attributes) {
				const attribute = attributes[name];

				// Skip WordPress core blocks attributes or current attribute was not default value!
				if (
					!attribute.hasOwnProperty('default') ||
					/^(?!blockera\w+).*/i.test(name) ||
					['blockeraPropsId', 'blockeraCompatId'].includes(name)
				) {
					continue;
				}

				// Assertion for sync registered default attribute value with type!
				expect(
					attribute?.type === typeof attribute.default
				).to.be.equal(true);

				if ('undefined' === typeof attribute.default.value) {
					// Assertion for sync registered default attribute value with selected block attribute value.
					expect(attribute.default).to.be.deep.equal(
						getSelectedBlock(data, name)
					);
				} else {
					// Assertion for sync registered default attribute value with selected block attribute value.
					expect(attribute.default.value).to.be.deep.equal(
						getSelectedBlock(data, name)
					);
				}
			}
		});
	});
});
