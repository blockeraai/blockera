/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

if (experimental().get('editor.extensions.iconExtension')) {
	describe('icon-control', () => {
		beforeEach(() => {
			createPost();
			appendBlocks(`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Test btn 1</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`);

			cy.getBlock('core/button').click();

			cy.getByDataTest('settings-tab').click();
		});

		context('Functional', () => {
			// @debug-ignore
			it.skip('should be able to upload custom svg when there is selected icon', () => {
				// act
				cy.get('[aria-label="button Icon"]').click();
				cy.contains('button', /upload svg/i).click({ force: true });
				cy.get('input[type="file"]').selectFile(
					'cypress/fixtures/home.svg',
					{
						force: true,
					}
				);

				cy.get('.media-toolbar-primary > .button').click();

				// data assertion

				// eslint-disable-next-line cypress/no-unnecessary-waiting
				cy.wait(200).then(() => {
					getWPDataObject().then((data) => {
						const uploadedFileName = getSelectedBlock(
							data,
							'blockeraIcon'
						).uploadSVG.filename;
						expect(uploadedFileName).to.match(/home(-\d+)?.svg/);
					});
				});
			});

			// @debug-ignore
			it.skip('should be able to add new icon from library', () => {
				// act
				cy.get('[aria-label="Icon Library"]').click();

				cy.get('input[type="search"]').eq(1).type('pub');
				cy.get('span[aria-label="blockera Icon"]').click();

				// data assertion
				getWPDataObject().then((data) => {
					const selectedIconName = getSelectedBlock(
						data,
						'blockeraIcon'
					).icon;
					expect(selectedIconName).to.be.equal('blockera');
				});
			});

			it('should be able to delete selected icon', () => {
				// act
				cy.get('[aria-label="Choose Icon…"]').click();

				cy.get('span[aria-label="blockera Icon"]').click();

				// act
				// cy.get('[aria-label="button Icon"]').click();
				cy.get('button[aria-label="Remove Icon"]').click({
					force: true,
				});

				// data assertion
				getWPDataObject().then((data) => {
					const selectedIconName = getSelectedBlock(
						data,
						'blockeraIcon'
					).icon;
					expect(selectedIconName).to.be.equal('');
				});
			});
		});
	});
}
