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

describe('Testing core/gallery block registered default attributes value', () => {
	beforeEach(() => {
		createPost();
	});

	it('should valid sets default blockeraDisplay attribute value', () => {
		addBlockToPost('core/gallery');

		cy.getBlock('core/gallery').first().click();

		getWPDataObject().then((data) => {
			const attributes = getBlockType(data, 'core/gallery').attributes;

			// Assertion for sync registered default "blockeraDisplay" value with type!
			expect(
				attributes?.blockeraDisplay?.type ===
					typeof attributes?.blockeraDisplay?.default
			).to.be.equal(true);

			// Assertion for sync registered default "blockeraDisplay" value with selected block "blockeraDisplay" value.
			expect(attributes?.blockeraDisplay?.default).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});
	});
});
