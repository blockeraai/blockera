/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setBoxSpacingSide,
	clearBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Box Spacing → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple Spacing', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"20px","right":"30px","bottom":"40px","left":"50px"},"margin":{"top":"15px","right":"30px","bottom":"45px","left":"60px"}}}} -->
<p style="margin-top:15px;margin-right:30px;margin-bottom:45px;margin-left:60px;padding-top:20px;padding-right:30px;padding-bottom:40px;padding-left:50px">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '15px',
						right: '30px',
						bottom: '45px',
						left: '60px',
					},
					padding: {
						top: '20px',
						right: '30px',
						bottom: '40px',
						left: '50px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 1: WP data to Blockera
			//

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '15px',
						right: '30px',
						bottom: '45px',
						left: '60px',
					},
					padding: {
						top: '20px',
						right: '30px',
						bottom: '40px',
						left: '50px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change padding
			setBoxSpacingSide('margin-top', '50');
			setBoxSpacingSide('margin-right', '100');
			setBoxSpacingSide('margin-bottom', '150');
			setBoxSpacingSide('margin-left', '200');

			// change padding
			setBoxSpacingSide('padding-top', '30');
			setBoxSpacingSide('padding-right', '60');
			setBoxSpacingSide('padding-bottom', '90');
			setBoxSpacingSide('padding-left', '120');

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '50px',
						right: '100px',
						bottom: '150px',
						left: '200px',
					},
					padding: {
						top: '30px',
						right: '60px',
						bottom: '90px',
						left: '120px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '50px',
						right: '100px',
						bottom: '150px',
						left: '200px',
					},
					padding: {
						top: '30px',
						right: '60px',
						bottom: '90px',
						left: '120px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear margin
			clearBoxSpacingSide('margin-top');
			clearBoxSpacingSide('margin-right');
			clearBoxSpacingSide('margin-bottom');
			clearBoxSpacingSide('margin-left');

			// clear padding
			clearBoxSpacingSide('padding-top');
			clearBoxSpacingSide('padding-right');
			clearBoxSpacingSide('padding-bottom');
			clearBoxSpacingSide('padding-left');

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});
		});
	});
});
