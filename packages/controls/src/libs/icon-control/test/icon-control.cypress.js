/**
 * Internal dependencies
 */
import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
} from '../../../../../../cypress/helpers';

describe('icon-control', () => {
	// TODO we will add these tests when adding visual tests
	// context('Rendering', () => {});

	context('Functional', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');
		});

		it('should be able to upload custom svg when there is selected icon', () => {
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
			getWPDataObject().then((data) => {
				const uploadedFileName = getSelectedBlock(data, 'publisherIcon')
					.uploadSVG.filename;
				expect(uploadedFileName).to.match(/home(-\d+)?.svg/);
			});
		});

		it('should be able to add new icon from library', () => {
			// act
			cy.get('[aria-label="Choose Icon…"]').click();

			cy.get('input[type="search"]').eq(1).type('pub');
			cy.get('span[aria-label="publisher Icon"]').click();

			// data assertion
			getWPDataObject().then((data) => {
				const selectedIconName = getSelectedBlock(
					data,
					'publisherIcon'
				).icon;
				expect(selectedIconName).to.be.equal('publisher');
			});
		});

		it('should be able to delete selected icon', () => {
			// act
			cy.get('[aria-label="button Icon"]').click();
			cy.get('button[aria-label="Remove Icon"]').click({ force: true });

			// data assertion
			getWPDataObject().then((data) => {
				const selectedIconName = getSelectedBlock(
					data,
					'publisherIcon'
				).icon;
				expect(selectedIconName).to.be.equal('');
			});
		});
	});

	context('Initial Value', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
		});

		it('should get data from context on reload', () => {
			// act
			cy.get('[aria-label="button Icon"]').click();
			cy.get('button[aria-label="Save draft"]').click();

			cy.visit(
				Cypress.env('testURL') + '/wp-admin/edit.php?post_type=post'
			).then(() => {
				cy.get('[aria-label="“(no title)” (Edit)"]').first().click();

				// wrap
				cy.getIframeBody();

				cy.getIframeBody().find('[data-type="core/paragraph"]').click();

				// assert
				cy.get('[aria-label="Remove Icon"]').siblings('svg');
			});
		});
	});
});
