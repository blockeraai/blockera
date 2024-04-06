/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

// This test makes sure us that if multiple typography features are used in one block, the data correctly comes to Blockera
describe('All Features Together → WP Compatibility', () => {
	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","fontSize":"20px","fontStyle":"italic","fontWeight":"400","lineHeight":"2","textDecoration":"underline","letterSpacing":"2px","writingMode":"vertical-rl"}}} -->\n' +
					'<p style="font-size:20px;font-style:normal;font-weight:400;letter-spacing:2px;line-height:2;text-decoration:underline;text-transform:uppercase;writing-mode:vertical-rl">Test paragraph</p>\n' +
					'<!-- /wp:paragraph --> '
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				//
				// text transform
				//
				expect('uppercase').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect('uppercase').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);

				//
				// Font Size
				//
				expect('20px').to.be.equal(
					getSelectedBlock(data, 'publisherFontSize')
				);

				expect('20px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
				);

				//
				// Font Style
				//
				expect('italic').to.be.equal(
					getSelectedBlock(data, 'publisherFontStyle')
				);

				expect('italic').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);

				//
				// Line Height
				//
				expect('2').to.be.equal(
					getSelectedBlock(data, 'publisherLineHeight')
				);

				expect('2').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.lineHeight
				);

				//
				// Text Decoration
				//
				expect('underline').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect('underline').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);

				//
				// Letter Spacing
				//
				expect('2px').to.be.equal(
					getSelectedBlock(data, 'publisherLetterSpacing')
				);

				expect('2px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.letterSpacing
				);

				//
				// Text Orientation
				//
				expect('style-1').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect('vertical-rl').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});
		});
	});
});