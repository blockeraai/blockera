/**
 * Blockera dependencies
 */
import {
	createPost,
	getBlockType,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Testing core/comments-pagination block registered default attributes value', () => {
	beforeEach(() => {
		createPost();
	});

	it('should valid sets default blockeraDisplay attribute value', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination').click();

		cy.getByAriaLabel('Select parent block: Comments Pagination').click();

		getWPDataObject().then((data) => {
			const attributes = getBlockType(
				data,
				'core/comments-pagination'
			).attributes;

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
