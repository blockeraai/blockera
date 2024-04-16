import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Opacity → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();
	});

	it('should update opacity, when adding value', () => {
		cy.getParentContainer('Opacity').within(() => {
			cy.get('input[type=range]').setSliderValue(50);
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'opacity',
			`${50 / 100}`
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('50%').to.be.equal(
				getSelectedBlock(data, 'publisherOpacity')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'opacity',
			`${50 / 100}`
		);
	});
});
