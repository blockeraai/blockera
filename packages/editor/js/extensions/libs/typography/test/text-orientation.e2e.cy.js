import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Orientation → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openMoreFeaturesControl('More typography settings');
	});

	it('should add two property to css:writing-mode & text-orientation, when click on shortcut', () => {
		//
		// Style 1
		//
		cy.getByAriaLabel('Vertical LR Mixed').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'mixed');

		//Check store
		assertBlockData((data) => {
			expect('style-1').to.be.equal(
				getSelectedBlock(data, 'blockeraTextOrientation')
			);
		});

		//
		// Style 2
		//
		cy.getByAriaLabel('Vertical RL Mixed').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-rl')
			.and('have.css', 'text-orientation', 'mixed');

		//Check store
		assertBlockData((data) => {
			expect('style-2').to.be.equal(
				getSelectedBlock(data, 'blockeraTextOrientation')
			);
		});

		//
		// Style 3
		//
		cy.getByAriaLabel('Vertical LR Upright').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'upright');

		//Check store
		assertBlockData((data) => {
			expect('style-3').to.be.equal(
				getSelectedBlock(data, 'blockeraTextOrientation')
			);
		});

		//
		// Style 4
		//
		cy.getByAriaLabel('Vertical RL Upright').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'writing-mode', 'vertical-rl')
			.and('have.css', 'text-orientation', 'upright');

		//Check store
		assertBlockData((data) => {
			expect('style-4').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraTextOrientation')
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
		assertBlockData((data) => {
			expect('initial').to.be.equal(
				getSelectedBlock(data, 'blockeraTextOrientation')
			);
		});

		// Switch to style 1
		cy.getByAriaLabel('Vertical LR Mixed').click();

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block')
			.should('have.css', 'writing-mode', 'vertical-lr')
			.and('have.css', 'text-orientation', 'mixed');
	});
});
