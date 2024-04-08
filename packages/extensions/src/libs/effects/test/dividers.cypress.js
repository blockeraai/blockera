import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
} from '../../../../../../cypress/helpers';

describe('Dividers → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Shape Dividers').as('dividers');
	});

	it('should add ::before to element,when add first divider', () => {
		cy.get('@dividers').within(() => {
			cy.getByAriaLabel('Add New Divider').click();
		});

		// Check static properties
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'relative')
			.and('have.css', 'overflow', 'hidden');

		cy.getBlock('core/paragraph')
			.then(($el) => {
				return window.getComputedStyle($el[0], '::before');
			})
			.as('element-before');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'content')
			.should('eq', '""');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'position')
			.should('eq', 'absolute');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'left')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-size')
			.should('eq', '100%');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-repeat')
			.should('eq', 'no-repeat');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '1');

		//add data
		cy.get('.components-popover').within(() => {
			cy.getByAriaLabel('Bottom').click();

			cy.getParentContainer('Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type(300, {
					force: true,
					delay: 0,
				});
				cy.get('select').select('px', {
					force: true,
				});
			});

			cy.getParentContainer('Height').within(() => {
				cy.get('input').clear();
				cy.get('input').type(200, {
					force: true,
					delay: 0,
				});
				cy.get('select').select('px', {
					force: true,
				});
			});

			cy.getParentContainer('Animation').within(() => {
				cy.get('input[type="checkbox"]').click({
					force: true,
				});

				cy.get('input[type="number"]').type(2);
			});

			cy.getParentContainer('Flip').within(() => {
				cy.get('input[type="checkbox"]').click({ force: true });
			});

			cy.getParentContainer('On Front').within(() => {
				cy.get('input[type="checkbox"]').click({
					force: true,
				});
			});

			cy.getByDataTest('divider-shape-button').click({ force: true });
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getByDataTest('wave-2').click({ force: true });
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getByDataCy('color-btn').click();
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('cecece');
			});

		//Check block
		cy.get('@element-before')
			.invoke('getPropertyValue', 'bottom')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'width')
			.should('eq', '300px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'height')
			.should('eq', '200px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '1000');

		cy.getBlock('core/paragraph')
			.parent()
			.within(() => {
				cy.get('style')
					.invoke('text')
					.should('include', 'transform')
					.and('include', 'scaleX(-1)');
			});

		cy.get('@element-before')
			.invoke('getPropertyValue', 'bottom')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-image')
			.should(
				'eq',
				`url("data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='%23cecece' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 34.0136C107.823 61.2245 247.959 21.0884 341.497 15.3061C435.034 9.52381 656.122 65.3061 772.449 59.5238C889.116 53.7415 930.612 30.9524 1012.24 29.932C1093.88 29.2517 1200 59.8639 1200 59.8639V0H0V34.0136Z' fill='%23cecece'/%3E%3C/svg%3E%0A")`
			);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				0: {
					isVisible: true,
					position: 'bottom',
					shape: {
						type: 'shape',
						id: 'wave-2',
					},
					color: '#cecece',
					size: {
						width: '300px',
						height: '200px',
					},
					animate: true,
					duration: '2ms',
					flip: true,
					onFront: true,
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherDivider'));
		});

		// Check frontend
		// todo implementation full test for frontend
	});

	it('should add ::after to element, when add second divider', () => {
		cy.get('@dividers').within(() => {
			cy.getByAriaLabel('Add New Divider').click();
			cy.getByAriaLabel('Add New Divider').click();
		});

		//Check static properties
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'relative')
			.and('have.css', 'overflow', 'hidden');

		cy.getBlock('core/paragraph')
			.then(($el) => {
				return window.getComputedStyle($el[0], '::after');
			})
			.as('element-before');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'content')
			.should('eq', '""');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'position')
			.should('eq', 'absolute');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'left')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-size')
			.should('eq', '100%');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-repeat')
			.should('eq', 'no-repeat');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '1');

		// cy.getByDataTest('divider-item-header').last().click();

		cy.get('.components-popover')
			.last()
			.within(() => {
				// todo uncomment following lines and fix codes to pass test
				cy.getByAriaLabel('Bottom').click();
				// cy.getByAriaLabel('Bottom').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// cy.get('button[data-value="top"]').should(
				// 	'have.attr',
				// 	'aria-disabled',
				// 	'true'
				// );

				cy.getParentContainer('Width').within(() => {
					cy.get('input').clear();
					cy.get('input').type(300, {
						force: true,
						delay: 0,
					});

					cy.get('select').select('px', {
						force: true,
					});
				});

				cy.getParentContainer('Height').within(() => {
					cy.get('input').clear();
					cy.get('input').type(200, {
						force: true,
						delay: 0,
					});
					cy.get('select').select('px', {
						force: true,
					});
				});

				cy.getParentContainer('Animation').within(() => {
					cy.get('input[type="checkbox"]').click({
						force: true,
					});
					cy.get('input[type="number"]').type(2);
				});

				cy.getParentContainer('Flip').within(() => {
					cy.get('input[type="checkbox"]').click({ force: true });
				});

				cy.getParentContainer('On Front').within(() => {
					cy.get('input[type="checkbox"]').click({
						force: true,
					});
				});

				cy.getByDataTest('divider-shape-button').click();
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getByDataTest('wave-2').click({ force: true });
				// cy.getByAriaLabel('Close').click();
			});

		cy.get('.components-popover').within(() => {
			cy.getByDataCy('color-btn').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('cecece');
			});

		//Check block
		cy.get('@element-before')
			.invoke('getPropertyValue', 'bottom')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'width')
			.should('eq', '300px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'height')
			.should('eq', '200px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '1000');

		cy.getBlock('core/paragraph')
			.parent()
			.within(() => {
				cy.get('style')
					.invoke('text')
					.should('include', 'transform')
					.and('include', 'scaleX(-1)');
			});

		cy.get('@element-before')
			.invoke('getPropertyValue', 'bottom')
			.should('eq', '0px');

		cy.get('@element-before')
			.invoke('getPropertyValue', 'background-image')
			.should(
				'eq',
				`url("data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='%23cecece' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 34.0136C107.823 61.2245 247.959 21.0884 341.497 15.3061C435.034 9.52381 656.122 65.3061 772.449 59.5238C889.116 53.7415 930.612 30.9524 1012.24 29.932C1093.88 29.2517 1200 59.8639 1200 59.8639V0H0V34.0136Z' fill='%23cecece'/%3E%3C/svg%3E%0A")`
			);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				0: {
					isVisible: true,
					position: 'top',
					shape: {
						type: 'shape',
						id: 'wave-opacity',
					},
					color: '',
					size: {
						width: '100%',
						height: '100px',
					},
					animate: false,
					duration: '',
					flip: false,
					onFront: false,
					order: 0,
				},
				1: {
					isVisible: true,
					position: 'bottom',
					shape: {
						type: 'shape',
						id: 'wave-2',
					},
					color: '#cecece',
					size: {
						width: '300px',
						height: '200px',
					},
					animate: true,
					duration: '2ms',
					flip: true,
					onFront: true,
					order: 1,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherDivider'));
		});

		//Check frontend
		// todo implementation full test for frontend
	});
});
