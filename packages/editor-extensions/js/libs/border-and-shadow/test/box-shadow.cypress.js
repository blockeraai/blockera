import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Box Shadow → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Box Shadows').as('container');
	});

	it('should update correctly, when adding one shadow', () => {
		cy.get('@container').within(() => {
			cy.get('[aria-label="Add New Box Shadow"]').click({
				force: true,
			});
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.getByDataTest('box-shadow-x-input').clear({ force: true });
			cy.getByDataTest('box-shadow-x-input').type(10, { force: true });

			cy.getByDataTest('box-shadow-y-input').clear({ force: true });
			cy.getByDataTest('box-shadow-y-input').type(50, { force: true });

			cy.getByDataTest('box-shadow-blur-input').clear({ force: true });
			cy.getByDataTest('box-shadow-blur-input').type(30, { force: true });

			cy.getByDataTest('box-shadow-spread-input').clear({ force: true });
			cy.getByDataTest('box-shadow-spread-input').type(40, {
				force: true,
			});

			cy.getByDataTest('box-shadow-color-control').click({ force: true });
		});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('c5eef0ab', {
					force: true,
				});
			});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'box-shadow',
			'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'outer-0': {
					isVisible: true,
					type: 'outer',
					x: '10px',
					y: '50px',
					blur: '30px',
					spread: '40px',
					color: '#c5eef0ab',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBoxShadow'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'box-shadow',
			'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px'
		);
	});

	it('should update correctly, when adding multiple shadow', () => {
		cy.get('@container').within(() => {
			cy.multiClick('[aria-label="Add New Box Shadow"]', 2);
			cy.getByDataCy('group-control-header').eq(0).click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.getByDataTest('box-shadow-x-input').clear({ force: true });
			cy.getByDataTest('box-shadow-x-input').type(10, { force: true });

			cy.getByDataTest('box-shadow-y-input').clear({ force: true });
			cy.getByDataTest('box-shadow-y-input').type(50, { force: true });

			cy.getByDataTest('box-shadow-blur-input').clear({ force: true });
			cy.getByDataTest('box-shadow-blur-input').type(30, { force: true });

			cy.getByDataTest('box-shadow-spread-input').clear({ force: true });
			cy.getByDataTest('box-shadow-spread-input').type(40, {
				force: true,
			});

			cy.getByDataTest('box-shadow-color-control').click({ force: true });
		});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('c5eef0ab', {
					force: true,
					delay: 0,
				});
			});

		cy.get('@container').within(() => {
			cy.getByDataCy('group-control-header').eq(1).click();
		});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.getByAriaLabel('Inner').click({ force: true });

				cy.getByDataTest('box-shadow-x-input').clear({ force: true });
				cy.getByDataTest('box-shadow-x-input').type(20, {
					force: true,
				});

				cy.getByDataTest('box-shadow-y-input').clear({ force: true });
				cy.getByDataTest('box-shadow-y-input').type(0, { force: true });

				cy.getByDataTest('box-shadow-blur-input').clear({
					force: true,
				});
				cy.getByDataTest('box-shadow-blur-input').type(50, {
					force: true,
				});

				cy.getByDataTest('box-shadow-spread-input').clear({
					force: true,
				});
				cy.getByDataTest('box-shadow-spread-input').type(5, {
					force: true,
				});

				cy.getByDataTest('box-shadow-color-control').click({
					force: true,
				});
			});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('6a6969e6', {
					force: true,
					delay: 0,
				});
			});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'box-shadow',
			'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px, rgba(106, 105, 105, 0.9) 20px 0px 50px 5px inset'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'outer-0': {
					isVisible: true,
					type: 'outer',
					x: '10px',
					y: '50px',
					blur: '30px',
					spread: '40px',
					color: '#c5eef0ab',
					order: 0,
				},
				'inner-0': {
					isVisible: true,
					type: 'inner',
					x: '20px',
					y: '0px',
					blur: '50px',
					spread: '5px',
					color: '#6a6969e6',
					order: 1,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBoxShadow'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'box-shadow',
			'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px, rgba(106, 105, 105, 0.9) 20px 0px 50px 5px inset'
		);
	});
});
