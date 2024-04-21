import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Text Shadows → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('should update text-shadow, when add data', () => {
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

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.getByAriaLabel('Vertical Distance')
					.clear()
					.type(5)
					.should('have.value', '5');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.getByAriaLabel('Horizontal Distance')
					.clear()
					.type(6)
					.should('have.value', '6');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.getByAriaLabel('Blur Effect')
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraTextShadow'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
		);
	});
});
