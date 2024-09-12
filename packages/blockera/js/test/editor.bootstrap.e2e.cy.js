/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

/**
 * Blockera editor bootstrap scenarios.
 * we should check ensure of added registration shared and specific block type attributes store apis is existing on blockerEditor_VERSION global variable.
 *
 * support 3rd party plugins block types. for example => 'woocommerce/product-price'
 */
describe('Blockera editor bootstrapper', () => {
	it('should available store apis on blockera editor global variable', () => {
		createPost();

		cy.window().then((win) => {
			const blockeraEditorKey = Object.keys(win).filter((key) =>
				/blockeraEditor_/.test(key)
			);
			const blockeraEditor = win[blockeraEditorKey];

			expect(true).to.eq(
				blockeraEditor.editor.hasOwnProperty(
					'unstableRegistrationBlockTypeAttributes'
				)
			);
			expect(true).to.eq(
				blockeraEditor.editor.hasOwnProperty(
					'unstableRegistrationSharedBlockAttributes'
				)
			);
		});
	});
});
