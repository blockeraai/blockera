import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	setBoxPositionSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Box Position → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Position').as('container');
	});

	describe('Relative position', () => {
		it('relative position - using shortcuts in popover', () => {
			cy.get('@container').within(() => {
				cy.customSelect('Relative');
			});

			cy.getByAriaLabel('Top Position').click();
			cy.getByAriaLabel('Set 10px').click();

			cy.getByAriaLabel('Right Position').click();
			cy.getByAriaLabel('Set 60px').click();

			cy.getByAriaLabel('Bottom Position').click();
			cy.getByAriaLabel('Set 30px').click();

			cy.getByAriaLabel('Left Position').click();
			cy.getByAriaLabel('Set 80px').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'relative')
				.and('have.css', 'top', '10px')
				.and('have.css', 'Right', '60px')
				.and('have.css', 'Bottom', '30px')
				.and('have.css', 'Left', '80px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'relative',
					position: {
						top: '10px',
						right: '60px',
						bottom: '30px',
						left: '80px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block').as('element-style');

			cy.get('@element-style').should('have.css', 'position', 'relative');

			cy.get('@element-style').should('have.css', 'top', '10px');

			cy.get('@element-style').should('have.css', 'right', '60px');

			cy.get('@element-style').should('have.css', 'bottom', '30px');

			cy.get('@element-style').should('have.css', 'left', '80px');
		});
	});

	describe('Absolute position', () => {
		it('Absolute position - using shortcuts after control', () => {
			cy.get('@container').within(() => {
				cy.customSelect('Absolute');
			});

			//
			// Top Left Button
			//
			cy.getByAriaLabel('Fix At Top Left Corner').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'left', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						left: '0px',
						bottom: '',
						right: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Top Right Button
			//
			cy.getByAriaLabel('Fix At Top Right Corner').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'right', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '0px',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Bottom Left Button
			//
			cy.getByAriaLabel('Fix At Bottom Left Corner').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'left', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '',
						right: '',
						bottom: '0px',
						left: '0px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Bottom Right Button
			//
			cy.getByAriaLabel('Fix At Bottom Right Corner').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'right', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '',
						right: '0px',
						bottom: '0px',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Full-Width At Top Button
			//
			cy.getByAriaLabel('Position As Full-Width At Top Side').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'left', '0px')
				.and('have.css', 'right', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '0px',
						bottom: '',
						left: '0px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Full-Width At Bottom Button
			//
			cy.getByAriaLabel('Position As Full-Width At Bottom Side').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'left', '0px')
				.and('have.css', 'right', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '',
						right: '0px',
						bottom: '0px',
						left: '0px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Full-Height At Right Button
			//
			cy.getByAriaLabel('Position As Full-Height At Right Side').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'right', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '0px',
						bottom: '0px',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Full-Height At Left Button
			//
			cy.getByAriaLabel('Position As Full-Height At Left Side').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'left', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '',
						bottom: '0px',
						left: '0px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Full-Width and Full-Height Button
			//
			cy.getByAriaLabel('Position As Full-Width and Full-Height').click();

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'position', 'absolute')
				.and('have.css', 'top', '0px')
				.and('have.css', 'bottom', '0px')
				.and('have.css', 'right', '0px')
				.and('have.css', 'left', '0px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '0px',
						bottom: '0px',
						left: '0px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Centrally With Equal Margins (20%) From All Edges Button

			//
			cy.getByAriaLabel(
				'Position Centrally With Equal Margins (20%) From All Edges'
			).click();

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '20%',
						right: '20%',
						bottom: '20%',
						left: '20%',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.as('element-style');

			cy.get('@element-style')
				.invoke('getPropertyValue', 'position')
				.should('eq', 'absolute');

			// should have left value
			cy.get('@element-style')
				.invoke('getPropertyValue', 'left')
				.then((leftValue) => {
					expect(leftValue).to.not.equal('');
					expect(leftValue).to.not.equal(null);
				});

			// should have top value
			cy.get('@element-style')
				.invoke('getPropertyValue', 'top')
				.then((topValue) => {
					expect(topValue).to.not.equal('');
					expect(topValue).to.not.equal(null);
				});

			// should have right value
			cy.get('@element-style')
				.invoke('getPropertyValue', 'right')
				.then((rightValue) => {
					expect(rightValue).to.not.equal('');
					expect(rightValue).to.not.equal(null);
				});

			// should have bottom value
			cy.get('@element-style')
				.invoke('getPropertyValue', 'bottom')
				.then((bottomValue) => {
					expect(bottomValue).to.not.equal('');
					expect(bottomValue).to.not.equal(null);
				});
		});
	});

	describe('Labels tests', () => {
		it('Label on sides with different value types', () => {
			cy.get('@container').within(() => {
				cy.customSelect('Relative');
			});

			const items = ['top', 'right', 'bottom', 'left'];

			items.forEach((item) => {
				cy.get(
					`[data-cy="box-position-label-${item}"] [data-cy="label-control"]`
				).as('Position');

				//
				// Default label
				//
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-');
					});

				//
				// Change to 10 (10px)
				//
				setBoxPositionSide(item, 10);
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('10');
					});

				//
				// Change to EM
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[aria-label="Select Unit"]').select('em');
					});
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('10em');
					});

				//
				// Change to Px and negative value
				//
				if (
					[
						'margin-top',
						'margin-right',
						'margin-bottom',
						'margin-left',
					].includes(item)
				) {
					cy.get('[data-wp-component="Popover"]')
						.last()
						.within(() => {
							cy.get('[aria-label="Select Unit"]').select('px');
							cy.get('input[type=number]').type('-15');
						});

					cy.get('@Position')
						.invoke('text')
						.then((text) => {
							expect(text.trim().replace(item, '')).to.eq('-15');
						});
				}

				//
				// Change to CSS Func
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[aria-label="Select Unit"]').select('func');
						cy.get('input[type=text]').clear();
						cy.get('input[type=text]').type('calc(10px + 10px)');
					});

				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('CSS');
					});

				//
				// Change to a variable
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.openValueAddon();
						cy.selectValueAddonItem('10');
					});

				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('1');
					});
			});
		});
	});

	describe('Drag Value Changes', () => {
		it('change values with drag', () => {
			cy.get('@container').within(() => {
				cy.customSelect('Absolute');
			});

			const verticalItems = ['top', 'bottom'];

			verticalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-position-label-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-position-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('vertical', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('vertical', -35);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-15');
					});
			});

			const horizontalItems = ['left', 'right'];

			horizontalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-position-label-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-position-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('horizontal', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('horizontal', -35);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-15');
					});
			});
		});
	});
});
