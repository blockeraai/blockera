import {
	savePage,
	createPost,
	appendBlocks,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Shadows → Functionality', () => {
	beforeEach(() => {
		createPost();
	});

	it('single text shadow + promotion popover', () => {
		cy.getBlock('default').type('This is test paragraph', {
			delay: 0,
		});
		cy.getByDataTest('style-tab').click();

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
				cy.get('input[maxlength="9"]').type('70ca9e', { delay: 0 });
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

		cy.get('p.blockera-block').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px'
		);
	});

	it('multiple text shadows', () => {
		appendBlocks(`<!-- wp:paragraph {"blockeraPropsId":"9692dad8-b400-483f-9c1a-0e0bb0465e36","blockeraCompatId":"109184054630","blockeraTextShadow":{"value":{"0":{"isVisible":true,"x":"2px","y":"3px","blur":"4px","color":"#70ca9e","order":0},"1":{"isVisible":true,"x":"5px","y":"6px","blur":"7px","color":"#70ca9e","order":1}}},"className":"blockera-block blockera-block-negdp8"} -->
<p class="blockera-block blockera-block-negdp8">This is test text.</p>
<!-- /wp:paragraph -->`);
		cy.getBlock('core/paragraph').click();

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

		cy.get('p.blockera-block').should(
			'have.css',
			'text-shadow',
			'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
		);
	});
});
