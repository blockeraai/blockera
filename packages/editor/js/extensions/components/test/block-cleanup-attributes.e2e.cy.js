/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
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
		getWPDataObject().then((data) => {
			expect(
				'<!-- wp:paragraph -->\n' +
					'<p>test</p>\n' +
					'<!-- /wp:paragraph -->'.trim()
			).to.be.equal(getEditorContent(data).trim());
		});
	});

	it('should exists blockeraPropsId, blockeraCompatId, blockeraFontColor, and blockera classnames values on selected block when changed text-color control', () => {
		// Set value.
		cy.setColorControlValue('Text Color', 'aaa');

		getWPDataObject().then((data) => {
			const blockAttributes = getSelectedBlock(data)?.attributes;

			expect(true).to.be.equal(
				blockAttributes?.blockeraPropsId &&
					blockAttributes?.blockeraCompatId &&
					'#aaaaaa' === blockAttributes?.blockeraFontColor &&
					-1 !== blockAttributes?.className?.indexOf('blockera-block')
			);
		});
	});
});
