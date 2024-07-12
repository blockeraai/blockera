import {
	createPost,
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	setBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacing Extension', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();
	});

	describe('Margin', () => {
		it('Simple value', () => {
			setBoxSpacingSide('margin-top', 10);
			setBoxSpacingSide('margin-right', 20);
			setBoxSpacingSide('margin-bottom', 10);
			setBoxSpacingSide('margin-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					padding: { top: '', right: '', bottom: '', left: '' },
					margin: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');
		});
	});

	describe('Padding', () => {
		it('Simple value', () => {
			setBoxSpacingSide('padding-top', 10);
			setBoxSpacingSide('padding-right', 20);
			setBoxSpacingSide('padding-bottom', 10);
			setBoxSpacingSide('padding-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');
		});
	});
});
