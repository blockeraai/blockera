import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Text Shadows → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.');

		cy.getByDataTest('style-tab').click();
	});

	it('should update text-shadow, when add data', () => {
		/* One Text Shadow */
		cy.getParentContainer('Text Shadows', 'base-control').within(() => {
			cy.getByAriaLabel('Add New Text Shadow').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Vertical Distance"]')
				.clear()
				.type(2)
				.should('have.value', '2');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Horizontal Distance"]')
				.clear()
				.type(3)
				.should('have.value', '3');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Blur Effect"]')
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
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherTextShadow'));
		});

		/* Multiple Text Shadow */
		cy.getParentContainer('Text Shadows', 'base-control').within(() => {
			cy.getByAriaLabel('Add New Text Shadow').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Vertical Distance"]')
				.clear()
				.type(5)
				.should('have.value', '5');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Horizontal Distance"]')
				.clear()
				.type(6)
				.should('have.value', '6');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Blur Effect"]')
				.clear()
				.type(7)
				.should('have.value', '7');

			cy.getByDataCy('color-btn').click();
		});

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
			'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
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
				1: {
					isVisible: true,
					x: '5px',
					y: '6px',
					blur: '7px',
					color: '#70ca9e',
					order: 1,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherTextShadow'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
		);
	});
});
