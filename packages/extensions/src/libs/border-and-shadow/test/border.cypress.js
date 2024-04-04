import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Border → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Border Line').as('container');
	});

	it('should update border when add same data to all side', () => {
		cy.get('@container').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5, {
				force: true,
			});

			cy.getByDataTest('border-control-color').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type('37e6d4');
		});

		cy.get('@container').within(() => {
			cy.get('[aria-haspopup="listbox"]').click();
			cy.get('li').eq(1).click();
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border',
			'5px dashed rgb(55, 230, 212)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'all',
				all: {
					width: '5px',
					style: 'dashed',
					color: '#37e6d4',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'border',
			'5px dashed rgb(55, 230, 212)'
		);
	});

	it('all side but not select border style', () => {
		cy.get('@container').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5, {
				force: true,
			});

			cy.getByDataTest('border-control-color').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type('37e6d4');
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border',
			'5px solid rgb(55, 230, 212)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'all',
				all: {
					width: '5px',
					style: 'solid',
					color: '#37e6d4',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'border',
			'5px solid rgb(55, 230, 212)'
		);
	});

	it('custom borders', () => {
		//
		// Top Border
		//
		cy.get('@container').within(() => {
			cy.getByAriaLabel('Custom Box Border').click();
			cy.getByDataTest('border-control-component')
				.eq(0)
				.within(() => {
					cy.getByDataTest('border-control-width').clear();
					cy.getByDataTest('border-control-width').type(1, {
						force: true,
					});

					cy.get('[aria-haspopup="listbox"]').trigger('click');
					cy.get('li').eq(0).trigger('click');

					cy.getByDataTest('border-control-color').click();
				});
		});

		// color
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear({ force: true });
			cy.get('input[maxlength="9"]').type('73ddab', { force: true });
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-top',
			'1px solid rgb(115, 221, 171)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'custom',
				all: { color: '', style: '', width: '' },
				left: { color: '', style: '', width: '' },
				right: { color: '', style: '', width: '' },
				bottom: { color: '', style: '', width: '' },
				top: {
					color: '#73ddab',
					style: 'solid',
					width: '1px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		//
		// Right Border
		//
		cy.get('@container').within(() => {
			cy.getByDataTest('border-control-component')
				.eq(1)
				.within(() => {
					cy.getByDataTest('border-control-width').clear({
						force: true,
					});
					cy.getByDataTest('border-control-width').type(2, {
						force: true,
					});

					cy.get('[aria-haspopup="listbox"]').trigger('click');
					cy.get('li').eq(1).trigger('click');

					cy.getByDataTest('border-control-color').click();
				});
		});

		// color
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type('9958e3');
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-right',
			'2px dashed rgb(153, 88, 227)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'custom',
				all: { color: '', style: '', width: '' },
				left: { color: '', style: '', width: '' },
				right: {
					color: '#9958e3',
					style: 'dashed',
					width: '2px',
				},
				bottom: { color: '', style: '', width: '' },
				top: {
					color: '#73ddab',
					style: 'solid',
					width: '1px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		//
		// Bottom Border
		//
		cy.get('@container').within(() => {
			cy.getByDataTest('border-control-component')
				.eq(2)
				.within(() => {
					cy.getByDataTest('border-control-width').clear({
						force: true,
					});
					cy.getByDataTest('border-control-width').type(3, {
						force: true,
					});

					cy.get('[aria-haspopup="listbox"]').trigger('click');
					cy.get('li').eq(2).trigger('click');

					cy.getByDataTest('border-control-color').click();
				});
		});

		// color
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear({ force: true });
			cy.get('input[maxlength="9"]').type('eba492', { force: true });
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-bottom',
			'3px dotted rgb(235, 164, 146)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'custom',
				all: { color: '', style: '', width: '' },
				left: { color: '', style: '', width: '' },
				right: {
					color: '#9958e3',
					style: 'dashed',
					width: '2px',
				},
				bottom: {
					color: '#eba492',
					style: 'dotted',
					width: '3px',
				},
				top: {
					color: '#73ddab',
					style: 'solid',
					width: '1px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		//
		// Left Border
		//
		cy.get('@container').within(() => {
			cy.getByDataTest('border-control-component')
				.eq(3)
				.within(() => {
					cy.getByDataTest('border-control-width').clear({
						force: true,
					});
					cy.getByDataTest('border-control-width').type(4, {
						force: true,
					});

					cy.get('[aria-haspopup="listbox"]').trigger('click');
					cy.get('li').eq(3).trigger('click');

					cy.getByDataTest('border-control-color').click();
				});
		});

		// color
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear({ force: true });
			cy.get('input[maxlength="9"]').type('1893da', { force: true });
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'border-left',
			'4px double rgb(24, 147, 218)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'custom',
				all: { color: '', style: '', width: '' },
				left: {
					color: '#1893da',
					style: 'double',
					width: '4px',
				},
				right: {
					color: '#9958e3',
					style: 'dashed',
					width: '2px',
				},
				bottom: {
					color: '#eba492',
					style: 'dotted',
					width: '3px',
				},
				top: {
					color: '#73ddab',
					style: 'solid',
					width: '1px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherBorder'));
		});

		// 	Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'border-top',
			'1px solid rgb(115, 221, 171)'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'border-right',
			'2px dashed rgb(153, 88, 227)'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'border-bottom',
			'3px dotted rgb(235, 164, 146)'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'border-left',
			'4px double rgb(24, 147, 218)'
		);
	});
});
