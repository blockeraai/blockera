import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Layout → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		// change to flex
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('should update flex direction correctly', () => {
		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('Row').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'row'
		);

		getWPDataObject().then((data) => {
			expect('row').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('Column').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'column'
		);

		getWPDataObject().then((data) => {
			expect('column').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'flex-direction',
			'column'
		);
	});

	describe('Flex Align Items & Justify Content', () => {
		['Row', 'Column'].forEach((type) => {
			describe(type + ' Direction', () => {
				it('Top - Left', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-top-left-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						'flex-start'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						'flex-start'
					);

					getWPDataObject().then((data) => {
						expect('flex-start').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-start').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						'flex-start'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						'flex-start'
					);
				});

				it('Top - Center', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-top-center-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-start' : 'center'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'center' : 'flex-start'
					);

					getWPDataObject().then((data) => {
						expect('flex-start').to.be.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('center').to.be.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-start' : 'center'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'center' : 'flex-start'
					);
				});

				it('Top - Right', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-top-right-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-start' : 'flex-end'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-end' : 'flex-start'
					);

					getWPDataObject().then((data) => {
						expect('flex-start').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-start' : 'flex-end'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-end' : 'flex-start'
					);
				});

				it('Center - Left', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-center-left-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'center' : 'flex-start'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-start' : 'center'
					);

					getWPDataObject().then((data) => {
						expect('center').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-start').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'center' : 'flex-start'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-start' : 'center'
					);
				});

				it('Center - Center', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-center-center-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						'center'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						'center'
					);

					getWPDataObject().then((data) => {
						expect('center').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('center').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						'center'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						'center'
					);
				});

				it('Center - Right', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-center-right-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'center' : 'flex-end'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-end' : 'center'
					);

					getWPDataObject().then((data) => {
						expect('center').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'center' : 'flex-end'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-end' : 'center'
					);
				});

				it('Bottom - Left', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-bottom-left-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-end' : 'flex-start'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-start' : 'flex-end'
					);

					getWPDataObject().then((data) => {
						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-start').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-end' : 'flex-start'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'flex-start' : 'flex-end'
					);
				});

				it('Bottom - Center', () => {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-bottom-center-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-end' : 'center'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'center' : 'flex-end'
					);

					getWPDataObject().then((data) => {
						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('center').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						type === 'Row' ? 'flex-end' : 'center'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						type === 'Row' ? 'center' : 'flex-end'
					);
				});

				it('Bottom - Right', () => {
					// change to Row
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel(type).click();
					});

					cy.getByDataTest('matrix-bottom-right-normal').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'align-items',
						'flex-end'
					);

					cy.getBlock('core/paragraph').should(
						'have.css',
						'justify-content',
						'flex-end'
					);

					getWPDataObject().then((data) => {
						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.alignItems
						);

						expect('flex-end').to.be.deep.equal(
							getSelectedBlock(data, 'blockeraFlexLayout')
								?.justifyContent
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.blockera-block').should(
						'have.css',
						'align-items',
						'flex-end'
					);

					cy.get('.blockera-block').should(
						'have.css',
						'justify-content',
						'flex-end'
					);
				});
			});
		});

		describe('Special units, Same for row and column', () => {
			['Row', 'Column'].forEach((type) => {
				describe(type + ' Direction', () => {
					it('Top - Space Around', () => {
						// change direction
						cy.getParentContainer('Flex Layout').within(() => {
							cy.getByAriaLabel(type).click();
						});

						cy.getByDataTest('matrix-top-left-normal').click();

						cy.getParentContainer('Flex Layout').within(() => {
							cy.get('button[aria-haspopup="listbox"]')
								.eq(1)
								.click();
							cy.get('ul[aria-hidden="false"]').within(() => {
								cy.contains('Space Around').click();
							});
						});

						cy.getBlock('core/paragraph').should(
							'have.css',
							'align-items',
							'flex-start'
						);

						cy.getBlock('core/paragraph').should(
							'have.css',
							'justify-content',
							'space-around'
						);

						getWPDataObject().then((data) => {
							expect('flex-start').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.alignItems
							);

							expect('space-around').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.justifyContent
							);
						});

						//Check frontend
						savePage();

						redirectToFrontPage();

						cy.get('.blockera-block').should(
							'have.css',
							'align-items',
							'flex-start'
						);

						cy.get('.blockera-block').should(
							'have.css',
							'justify-content',
							'space-around'
						);
					});

					it('Top - Space Between', () => {
						// change direction
						cy.getParentContainer('Flex Layout').within(() => {
							cy.getByAriaLabel(type).click();
						});

						cy.getByDataTest('matrix-top-left-normal').click();

						cy.getParentContainer('Flex Layout').within(() => {
							cy.get('button[aria-haspopup="listbox"]')
								.eq(1)
								.click();
							cy.get('ul[aria-hidden="false"]').within(() => {
								cy.contains('Space Between').click();
							});
						});

						cy.getBlock('core/paragraph').should(
							'have.css',
							'align-items',
							'flex-start'
						);

						cy.getBlock('core/paragraph').should(
							'have.css',
							'justify-content',
							'space-between'
						);

						getWPDataObject().then((data) => {
							expect('flex-start').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.alignItems
							);

							expect('space-between').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.justifyContent
							);
						});

						//Check frontend
						savePage();

						redirectToFrontPage();

						cy.get('.blockera-block').should(
							'have.css',
							'align-items',
							'flex-start'
						);

						cy.get('.blockera-block').should(
							'have.css',
							'justify-content',
							'space-between'
						);
					});

					it('Stretch - Left', () => {
						// change direction
						cy.getParentContainer('Flex Layout').within(() => {
							cy.getByAriaLabel(type).click();
						});

						cy.getByDataTest('matrix-top-left-normal').click();

						cy.getParentContainer('Flex Layout').within(() => {
							cy.get('button[aria-haspopup="listbox"]')
								.eq(0)
								.click();
							cy.get('ul[aria-hidden="false"]').within(() => {
								cy.contains('Stretch').click();
							});
						});

						cy.getBlock('core/paragraph').should(
							'have.css',
							'align-items',
							'stretch'
						);

						cy.getBlock('core/paragraph').should(
							'have.css',
							'justify-content',
							'flex-start'
						);

						getWPDataObject().then((data) => {
							expect('stretch').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.alignItems
							);

							expect('flex-start').to.be.deep.equal(
								getSelectedBlock(data, 'blockeraFlexLayout')
									?.justifyContent
							);
						});

						//Check frontend
						savePage();

						redirectToFrontPage();

						cy.get('.blockera-block').should(
							'have.css',
							'align-items',
							'stretch'
						);

						cy.get('.blockera-block').should(
							'have.css',
							'justify-content',
							'flex-start'
						);
					});
				});
			});
		});
	});
});
