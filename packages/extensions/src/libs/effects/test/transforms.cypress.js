import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Transforms → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer(
			'2D & 3D Transforms',
			'publisher-repeater-control'
		).as('transform');
	});

	context('Transform Feature', () => {
		it('should update transform, when add value to move', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			// Add data
			cy.get('.components-popover').within(() => {
				cy.get('[aria-label="Move-X"]').clear();
				cy.get('[aria-label="Move-X"]').type(150);

				cy.get('[aria-label="Move-Y"]').clear();
				cy.get('[aria-label="Move-Y"]').type(200);

				cy.get('[aria-label="Move-Z"]').clear();
				cy.get('[aria-label="Move-Z"]').type(100);
			});

			// Check block CSS
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							`transform: translate3d(150px, 200px, 100px);`
						);
				});

			// Check store data
			getWPDataObject().then((data) => {
				expect({
					'move-0': {
						isVisible: true,
						type: 'move',
						'move-x': '150px',
						'move-y': '200px',
						'move-z': '100px',
						order: 0,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should(
					'include',
					'transform:translate3d(150px, 200px, 100px);'
				);
		});

		it('should update transform, when add value to scale', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover').within(() => {
				cy.getByAriaLabel('Scale').click();

				cy.getByAriaLabel('Scale')
					.eq(1)
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('input[type=range]').setSliderValue(130);
					});
			});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'transform: scale3d(130%, 130%, 50%);'
						);
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					'scale-0': {
						type: 'scale',
						scale: '130%',
						isVisible: true,
						order: 0,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should('include', 'transform:scale3d(130%, 130%, 50%);');
		});

		it('should update transform, when add value to rotate', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover').within(() => {
				cy.getByAriaLabel('Rotate').click();

				cy.get('[aria-label="Rotate-X"]').type(10);
				cy.get('[aria-label="Rotate-Y"]').type(20);
				cy.get('[aria-label="Rotate-Z"]').type(30);
			});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'transform: rotateX(10deg) rotateY(20deg) rotateZ(30deg);'
						);
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					'rotate-0': {
						type: 'rotate',
						'rotate-x': '10deg',
						'rotate-y': '20deg',
						'rotate-z': '30deg',
						isVisible: true,
						order: 0,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should(
					'include',
					'transform:rotateX(10deg) rotateY(20deg) rotateZ(30deg);'
				);
		});

		it('should update transform, when add value to skew', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover').within(() => {
				cy.getByAriaLabel('Skew').click();

				cy.get('[aria-label="Skew-X"]').type(10);

				cy.get('[aria-label="Skew-Y"]').type(20);
			});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'transform: skew(10deg, 20deg);');
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					'skew-0': {
						type: 'skew',
						'skew-x': '10deg',
						'skew-y': '20deg',
						isVisible: true,
						order: 0,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should('include', 'transform:skew(10deg, 20deg);');
		});

		it('should update transform, when add multiple', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			cy.get('.components-popover').within(() => {
				cy.get('[aria-label="Skew"]').click();
				cy.get('[aria-label="Skew-X"]').type(10);
				cy.get('[aria-label="Skew-Y"]').type(20);
			});

			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			cy.get('.components-popover').within(() => {
				cy.get('[aria-label="Move"]').click();
				cy.get('[aria-label="Move-X"]').clear();
				cy.get('[aria-label="Move-X"]').type(150);
				cy.get('[aria-label="Move-Y"]').clear();
				cy.get('[aria-label="Move-Y"]').type(200);
				cy.get('[aria-label="Move-Z"]').clear();
				cy.get('[aria-label="Move-Z"]').type(100);
			});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'transform: skew(10deg, 20deg) translate3d(150px, 200px, 100px)'
						);
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					'skew-0': {
						type: 'skew',
						'skew-x': '10deg',
						'skew-y': '20deg',
						isVisible: true,
						order: 0,
					},
					'move-0': {
						type: 'move',
						'move-x': '150px',
						'move-y': '200px',
						'move-z': '100px',
						isVisible: true,
						order: 1,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransform')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should(
					'include',
					'transform:skew(10deg, 20deg) translate3d(150px, 200px, 100px)'
				);
		});
	});

	context('Transform Advanced Setting', () => {
		it('should update transform, when add value to self perspective', () => {
			cy.getByAriaLabel('Add New Transform').click();
			cy.getByAriaLabel('Transformation Settings').click();

			cy.getParentContainer('Self Perspective')
				// .first()
				.within(() => {
					cy.get('input[type="number"]').focus();
					cy.get('input[type="number"]').clear();
					cy.get('input[type="number"]').type(150);
				});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'transform: perspective(150px) translate3d(0px, 0px, 0px)'
						);
				});

			//Check store
			getWPDataObject().then((data) => {
				expect('150px').to.be.equal(
					getSelectedBlock(data, 'publisherTransformSelfPerspective')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should(
					'include',
					'transform:perspective(150px) translate3d(0px, 0px, 0px)'
				);
		});

		it('should update transform-origin, when add value to self origin', () => {
			cy.getByAriaLabel('Add New Transform').click();
			cy.getByAriaLabel('Transformation Settings').click();

			cy.getByAriaLabel('Self Perspective Origin').click();

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('span')
						.contains('center center')
						.click({ force: true });
				});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'transform-origin: 50% 50%;');
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({ top: '50%', left: '50%' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransformSelfOrigin')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should('include', 'transform-origin:50% 50%;');
		});

		it('should update backface-visibility, when add value to backface-visibility', () => {
			cy.getByAriaLabel('Add New Transform').click();
			cy.getByAriaLabel('Transformation Settings').click();

			cy.getParentContainer('Backface Visibility').within(() => {
				cy.get('[aria-label="Hidden"]').click();
			});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'backface-visibility: hidden;');
				});

			//Check store
			getWPDataObject().then((data) => {
				expect('hidden').to.be.equal(
					getSelectedBlock(data, 'publisherBackfaceVisibility')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should('include', 'backface-visibility:hidden;');
		});

		it('should update perspective, when add value to child perspective', () => {
			cy.get('[aria-label="Add New Transform"]').click();
			cy.get('[aria-label="Transformation Settings"]').click();

			cy.getParentContainer('Child Perspective', 'base-control').within(
				() => {
					cy.get('input[type="number"]').focus();
					cy.get('input[type="number"]').clear();
					cy.get('input[type="number"]').type(150);
				}
			);

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'perspective',
				'150px'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('150px').to.be.equal(
					getSelectedBlock(data, 'publisherTransformChildPerspective')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-core-block').should(
				'have.css',
				'perspective',
				'150px'
			);
		});

		it('should update perspective-origin, when add value to child origin', () => {
			cy.getByAriaLabel('Add New Transform').click();
			cy.getByAriaLabel('Transformation Settings').click();

			cy.getByAriaLabel('Child Perspective Origin').click();

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('span')
						.contains('center center')
						.click({ force: true });
				});

			//Check block
			cy.getBlock('core/paragraph')
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'perspective-origin: 50% 50%;');
				});

			//Check store
			getWPDataObject().then((data) => {
				expect({ top: '50%', left: '50%' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTransformChildOrigin')
				);
			});

			//Check frontEnd
			savePage();

			redirectToFrontPage();

			cy.get('style#publisher-core-inline-css-inline-css')
				.invoke('text')
				.should('include', 'perspective-origin:50% 50%;');
		});
	});
});
