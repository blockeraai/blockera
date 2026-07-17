/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	assertBlockData,
	getEditorContent,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('BlockBase testing ...', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
	});

	it('should not exists any value of blockera attributes on selected block when not changed anything', () => {
		assertBlockData((data) => {
			expect(
				'<!-- wp:paragraph -->\n' +
					'<p>test</p>\n' +
					'<!-- /wp:paragraph -->'.trim()
			).to.be.equal(getEditorContent(data).trim());
		});
	});

	it('should exists blockeraPropsId, blockeraCompatId, blockeraFontColor, and blockera classnames values on selected block when changed text-color control', () => {
		cy.getByAriaControls('styles-view').click();

		// Set value.
		cy.setColorControlValue('Text Color', 'aaaaaa');

		assertBlockData((data) => {
			const blockAttributes = getSelectedBlock(data)?.attributes;

			expect(true).to.be.equal(
				blockAttributes?.blockeraPropsId &&
					blockAttributes?.blockeraCompatId &&
					'#aaaaaa' === blockAttributes?.blockeraFontColor?.value &&
					-1 !== blockAttributes?.className?.indexOf('blockera-block')
			);
		});
	});
});
