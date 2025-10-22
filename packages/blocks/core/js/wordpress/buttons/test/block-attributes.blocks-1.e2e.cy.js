/**
 * Blockera dependencies
 */
import {
	createPost,
	addBlockToPost,
	getWPDataObject,
	getBlockType,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Testing core/buttons block registered default attributes value', () => {
	beforeEach(() => {
		createPost();
	});

	it('should valid sets default blockeraDisplay attribute value', () => {
		addBlockToPost('core/buttons');

		cy.getBlock('core/buttons').first().click();

		getWPDataObject().then((data) => {
			const attributes = getBlockType(data, 'core/buttons').attributes;

			// Assertion for sync registered default "blockeraDisplay" value with selected block "blockeraDisplay" value.
			expect(
				attributes?.blockeraDisplay?.default?.value
			).to.be.deep.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});
});
