/**
 * Internal dependencies
 */
import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
} from '../../../../../../cypress/helpers';

describe('media-image', () => {
	// TODO we will add these tests when adding visual tests
	// context('Rendering', () => {});

	context('Functional', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');
		});

		it('should be able to add image + delete existed image', () => {
			//  --------------------- add -----------------------
			//  act
			cy.getByDataTest('style-tab').click();
			cy.get('[aria-label="Add New Background"]').click();

			cy.contains('h2', 'Background')
				.parent()
				.find('[data-cy="repeater-item"]')
				.click();

			cy.contains('button', /choose image/i).click();

			cy.get('input[type="file"]').selectFile(
				'cypress/fixtures/test.jpg',
				{
					force: true,
				}
			);
			cy.get('.media-toolbar-primary > .button').click();

			// data assertion
			getWPDataObject().then((data) => {
				const uploadedImageFileName = getSelectedBlock(
					data,
					'publisherBackground'
				)[0]
					.image.split('/')
					.slice(-1);
				expect(uploadedImageFileName).to.be.match(/^test-\d+.jpg/);
			});

			//----------------------- delete ---------------------------------
			// act
			cy.getByDataCy('delete-bg-img').click({ force: true });

			// data assertion
			getWPDataObject().then((data) => {
				const uploadedImageName = getSelectedBlock(
					data,
					'publisherBackground'
				)[0].image;
				expect(uploadedImageName).to.be.equal('');
			});
		});

		it('should open the uploader by clicking on action buttons', () => {
			//  act
			cy.getByDataTest('style-tab').click();
			cy.get('[aria-label="Add New Background"]').click();

			cy.contains('h2', 'Background')
				.parent()
				.find('[data-cy="repeater-item"]')
				.click();

			cy.contains('button', /choose image/i).click();

			cy.get('input[type="file"]').selectFile(
				'cypress/fixtures/test.jpg',
				{
					force: true,
				}
			);
			cy.get('.media-toolbar-primary > .button').click();

			cy.contains('button', /upload image/i).click({ force: true });

			// assert
			cy.get('[aria-labelledby="media-frame-title"]').should(
				'have.length',
				2
			);

			// act
			cy.contains('button', /media library/i).click({ force: true });

			// assert
			cy.get('[aria-labelledby="media-frame-title"]').should(
				'have.length',
				3
			);
		});

		// TODO
		// context('Initial Value', () => {
		// 	beforeEach(() => {
		// 		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		// 		cy.getIframeBody()
		// 			.find(`[data-type="core/paragraph"]`)
		// 			.type('this is test text.');
		// 	});
		// 	it('', () => {});
		// });
	});

	// TODO
	// context('Initial Value', () => {});
});
