import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Border Radius → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		// assign border to have visual of border-radius
		cy.getParentContainer('Border Line').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(2, {
				force: true,
			});
		});

		cy.getParentContainer('Radius').as('container');
	});

	it('should update correctly, when add same data to all corners', () => {
		cy.get('@container').within(() => {
			cy.get('input[type="number"]').clear({ force: true });
			cy.get('input[type="number"]').type(25, { force: true });
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-radius',
			'25px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({ type: 'all', all: '25px' }).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBorderRadius')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'border-radius', '25px');
	});

	it('should update correctly, when change all => custom', () => {
		cy.get('@container').within(() => {
			cy.get('input[type="number"]').clear({ force: true });
			cy.get('input[type="number"]').type(25, { force: true });

			cy.getByAriaLabel('Custom Border Radius').click();
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-top-left-radius',
			'25px'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-top-right-radius',
			'25px'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-bottom-left-radius',
			'25px'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-bottom-left-radius',
			'25px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'custom',
				all: '25px',
				topLeft: '25px',
				topRight: '25px',
				bottomLeft: '25px',
				bottomRight: '25px',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorderRadius'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'border-top-left-radius',
			'25px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-top-right-radius',
			'25px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-bottom-left-radius',
			'25px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-bottom-left-radius',
			'25px'
		);
	});

	it('custom border radius', () => {
		//
		// topLeft
		//
		cy.get('@container').within(() => {
			cy.getByAriaLabel('Custom Border Radius').click();
			cy.get('input[type="number"]').eq(0).type(25, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-top-left-radius',
			'25px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('custom').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').type
			);

			expect('25px').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').topLeft
			);
		});

		//
		// topRight
		//
		//
		cy.get('@container').within(() => {
			cy.get('input[type="number"]').eq(1).clear({ force: true });
			cy.get('input[type="number"]').eq(1).type(35, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-top-right-radius',
			'35px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('custom').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').type
			);

			expect('35px').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').topRight
			);
		});

		//
		// bottomLeft
		//
		cy.get('@container').within(() => {
			cy.get('input[type="number"]').eq(2).clear({ force: true });
			cy.get('input[type="number"]').eq(2).type(45, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-bottom-left-radius',
			'45px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('custom').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').type
			);

			expect('45px').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').bottomLeft
			);
		});

		//
		// bottomRight
		//
		cy.get('@container').within(() => {
			cy.get('input[type="number"]').eq(3).clear({ force: true });
			cy.get('input[type="number"]').eq(3).type(55, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-bottom-right-radius',
			'55px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('custom').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').type
			);

			expect('55px').to.be.equal(
				getSelectedBlock(data, 'blockeraBorderRadius').bottomRight
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'border-top-left-radius',
			'25px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-top-right-radius',
			'35px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-bottom-left-radius',
			'45px'
		);

		cy.get('.blockera-block').should(
			'have.css',
			'border-bottom-right-radius',
			'55px'
		);
	});
});
