/**
 * Blockera dependencies
 */
import {
	createPost,
	getWindowProperty,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Blockera editor bootstrap scenarios.
 * we should check ensure of added registration shared and specific block type attributes store apis is existing on blockerEditor_VERSION global variable.
 */
describe('Blockera editor bootstrapper', () => {
	beforeEach(() => {
		createPost();
	});

	it('should available store apis on blockera editor global variable', () => {
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
