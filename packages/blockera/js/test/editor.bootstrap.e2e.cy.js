/**
 * Blockera dependencies
 */
import {
	createPost,
	getBlockType,
	addBlockToPost,
	getWPDataObject,
	getWindowProperty,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Blockera editor bootstrap scenarios.
 * we should check ensure of added registration shared and specific block type attributes store apis is existing on blockerEditor_VERSION global variable.
 *
 * support 3rd party plugins block types. for example => 'woocommerce/product-price'
 */
describe('Blockera editor bootstrapper', () => {
	it('should available store apis on blockera editor global variable', () => {
		createPost();

		getWindowProperty('blockeraEditor_1_0_0').then((data) => {
			expect(true).to.eq(
				data.editor.hasOwnProperty(
					'unstableRegistrationBlockTypeAttributes'
				)
			);
			expect(true).to.eq(
				data.editor.hasOwnProperty(
					'unstableRegistrationSharedBlockAttributes'
				)
			);
		});
	});
});
