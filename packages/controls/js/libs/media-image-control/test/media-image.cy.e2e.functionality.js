/**
 * Blockera dependencies
 */
import {
	getWPDataObject,
	getSelectedBlock,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('media-image', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	context('Functional', () => {
		it('should be able to add image + delete existed image', () => {
			//  --------------------- add -----------------------
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.get('[aria-label="Add New Background"]').click();
			});

			cy.get('.blockera-component-popover').within(() => {
				cy.contains('button', /choose image/i).click();
			});

			cy.get('.media-modal').should('be.visible');

			cy.get('.media-modal').within(() => {
				cy.contains('button', 'Upload files').click();

				cy.get('input[type="file"]').selectFile(
					'packages/dev-cypress/js/fixtures/test.jpg',
					{
						force: true,
					}
				);

				cy.get('.media-toolbar-primary > .button').click();
			});

			cy.getParentContainer('Image & Gradient').within(() => {
				cy.get(
					'.blockera-component-color-indicator.image-custom'
				).should('be.visible');
			});

			getWPDataObject().then((data) => {
				const uploadedImageFileName = getSelectedBlock(
					data,
					'blockeraBackground'
				)
					['image-0'].image.split('/')
					.slice(-1);
				expect(uploadedImageFileName).to.be.match(/^test(-\d+)?.jpg/);
			});

			//----------------------- delete ---------------------------------
			cy.get('.blockera-component-popover').within(() => {
				cy.getParentContainer('Image')
					.last()
					.within(() => {
						cy.getByDataCy('delete-bg-img').click({ force: true });
					});
			});

			// data assertion
			getWPDataObject().then((data) => {
				const uploadedImageName = getSelectedBlock(
					data,
					'blockeraBackground'
				)['image-0'].image;
				expect(uploadedImageName).to.be.equal('');
			});
		});

		it('should open the uploader by clicking on action buttons', () => {
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.get('[aria-label="Add New Background"]').click();
			});

			cy.get('.blockera-component-popover').within(() => {
				cy.contains('button', /choose image/i).click();
			});

			cy.get('.media-modal').should('be.visible');

			cy.get('.media-modal').within(() => {
				cy.contains('button', 'Upload files').click();

				cy.get('input[type="file"]').selectFile(
					'packages/dev-cypress/js/fixtures/test.jpg',
					{
						force: true,
					}
				);

				cy.get('.media-toolbar-primary > .button').click();
			});

			cy.get('.blockera-component-popover').within(() => {
				cy.contains('button', /upload image/i).click({ force: true });
			});

			cy.get('.media-modal').should('be.visible');

			// there should be 3 tag on document because of how wp works and we opened media uploader 3 times
			cy.get('[aria-labelledby="media-frame-title"]').should(
				'have.length',
				2
			);
		});
	});

	context('Initial Value', () => {
		it('should get data from context on reload', () => {
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.get('[aria-label="Add New Background"]').click();
			});

			cy.get('.blockera-component-popover').within(() => {
				cy.contains('button', /choose image/i).click();
			});

			cy.get('.media-modal').should('be.visible');

			cy.get('.media-modal').within(() => {
				cy.contains('button', 'Upload files').click();

				cy.get('input[type="file"]').selectFile(
					'packages/dev-cypress/js/fixtures/test.jpg',
					{
						force: true,
					}
				);

				cy.get('.media-toolbar-primary > .button').click();
			});

			cy.get('button[aria-label="Save draft"]').click();

			cy.visit(
				Cypress.env('testURL') + '/wp-admin/edit.php?post_type=post'
			).then(() => {
				cy.get('[aria-label="“(no title)” (Edit)"]').first().click();

				cy.getIframeBody().getBlock('core/paragraph').click();

				cy.getByDataTest('style-tab').click();

				cy.getParentContainer('Image & Gradient').within(() => {
					cy.getByDataCy('repeater-item').should('exist');

					cy.getByDataCy('repeater-item').click();
				});

				cy.get('.blockera-component-popover').within(() => {
					cy.get('img')
						.invoke('attr', 'src')
						.then((src) => {
							const src1 = src;

							expect(src).contains('test');
						});
				});
			});
		});
	});
});
