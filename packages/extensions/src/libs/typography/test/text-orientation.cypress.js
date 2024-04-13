import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Text Orientation → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		openMoreFeaturesControl('More typography settings');
	});

	it('should add two property to css:writing-mode & text-orientation, when click on shortcut', () => {
		//
		// Style 1
		//
		cy.getByAriaLabel(
			'Text will display vertically from left to right with a mixed orientation'
		).click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'mixed');

		//Check store
		getWPDataObject().then((data) => {
			expect('style-1').to.be.equal(
				getSelectedBlock(data, 'publisherTextOrientation')
			);
		});

		//
		// Style 2
		//
		cy.getByAriaLabel(
			'Text will display vertically from right to left with a mixed orientation'
		).click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-rl')
			.and('have.css', 'text-orientation', 'mixed');

		//Check store
		getWPDataObject().then((data) => {
			expect('style-2').to.be.equal(
				getSelectedBlock(data, 'publisherTextOrientation')
			);
		});

		//
		// Style 3
		//
		cy.getByAriaLabel(
			'Text will appear vertically from left to right with an upright orientation'
		).click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'upright');

		//Check store
		getWPDataObject().then((data) => {
			expect('style-3').to.be.equal(
				getSelectedBlock(data, 'publisherTextOrientation')
			);
		});

		//
		// Style 4
		//
		cy.getByAriaLabel(
			'Text will appear vertically from right to left with an upright orientation'
		).click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-rl')
			.and('have.css', 'text-orientation', 'upright');

		//Check store
		getWPDataObject().then((data) => {
			expect('style-4').to.be.deep.equal(
				getSelectedBlock(data, 'publisherTextOrientation')
			);
		});

		//
		// Style None
		//
		cy.getByAriaLabel('No text orientation').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'horizontal-tb')
			.and('have.css', 'text-orientation', 'mixed');

		//Check store
		getWPDataObject().then((data) => {
			expect('initial').to.be.equal(
				getSelectedBlock(data, 'publisherTextOrientation')
			);
		});

		// Switch to style 1
		cy.getByAriaLabel(
			'Text will display vertically from left to right with a mixed orientation'
		).click();

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'mixed');
	});
});
