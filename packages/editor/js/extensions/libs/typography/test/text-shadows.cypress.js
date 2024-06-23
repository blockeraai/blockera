import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Shadows → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('single text shadow + promotion popover', () => {
		/* One Text Shadow */
		cy.getParentContainer('Text Shadows').within(() => {
			cy.getByAriaLabel('Add New Text Shadow').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.getByAriaLabel('Vertical Distance')
				.clear()
				.type(2)
				.should('have.value', '2');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.getByAriaLabel('Horizontal Distance')
				.clear()
				.type(3)
				.should('have.value', '3');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.getByAriaLabel('Blur Effect')
				.clear()
				.type(4)
				.should('have.value', '4');

			cy.getByDataCy('color-btn').click();
		});

		// Color
		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('70ca9e', {
					force: true,
				});
			});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				0: {
					isVisible: true,
					x: '2px',
					y: '3px',
					blur: '4px',
					color: '#70ca9e',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraTextShadow'));
		});

		/* Multiple Text Shadow */
		cy.getParentContainer('Text Shadows').within(() => {
			cy.getByAriaLabel('Add New Text Shadow').click();
		});

		// promotion popover should appear
		cy.get('.blockera-component-promotion-popover').should('exist');

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px'
		);
	});
});
