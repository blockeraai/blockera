import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Transforms → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer(
			'2D & 3D Transforms',
			'blockera-repeater-control'
		).as('transform');
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	context('Transform Feature', () => {
		it('should update transform, when add value to move + promoter should be appear', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			// Add data
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('[aria-label="Move-X"]').clear();
					cy.get('[aria-label="Move-X"]').type(150);

					cy.get('[aria-label="Move-Y"]').clear();
					cy.get('[aria-label="Move-Y"]').type(200);

					cy.get('[aria-label="Move-Z"]').clear();
					cy.get('[aria-label="Move-Z"]').type(100);
				});

			// Check block CSS
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						`transform: translate3d(150px, 200px, 100px)`
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
					getSelectedBlock(data, 'blockeraTransform')
				);
			});

			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			// promotion popover should not appear
			cy.get('.blockera-component-promotion-popover').should('exist');

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					!enabledOptimizeStyleGeneration
						? 'transform: translate3d(150px, 200px, 100px) !important'
						: 'transform: translate3d(150px, 200px, 100px)'
				);
		});

		it('should update transform, when add value to scale', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Scale').click();

					cy.getByAriaLabel('Scale')
						.eq(1)
						.parents('[data-cy="base-control"]')
						.within(() => {
							cy.get('input[type=range]').setSliderValue(130);
						});
				});

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', 'transform: scale3d(130%, 130%, 50%)');
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
					getSelectedBlock(data, 'blockeraTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					!enabledOptimizeStyleGeneration
						? 'transform: scale3d(130%, 130%, 50%) !important'
						: 'transform: scale3d(130%, 130%, 50%)'
				);
		});

		it('should update transform, when add value to rotate', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Rotate').click();

					cy.get('[aria-label="Rotate-X"]').type(10);
					cy.get('[aria-label="Rotate-Y"]').type(20);
					cy.get('[aria-label="Rotate-Z"]').type(30);
				});

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'transform: rotateX(10deg) rotateY(20deg) rotateZ(30deg)'
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
					getSelectedBlock(data, 'blockeraTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					!enabledOptimizeStyleGeneration
						? 'transform: rotateX(10deg) rotateY(20deg) rotateZ(30deg) !important;'
						: 'transform: rotateX(10deg) rotateY(20deg) rotateZ(30deg)'
				);
		});

		it('should update transform, when add value to skew', () => {
			cy.get('@transform').within(() => {
				cy.getByAriaLabel('Add New Transform').click();
			});

			//Add data
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Skew').click();

					cy.get('[aria-label="Skew-X"]').type(10);

					cy.get('[aria-label="Skew-Y"]').type(20);
				});

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', 'transform: skew(10deg, 20deg)');
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
					getSelectedBlock(data, 'blockeraTransform')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					!enabledOptimizeStyleGeneration
						? 'transform: skew(10deg, 20deg) !important'
						: 'transform: skew(10deg, 20deg)'
				);
		});
	});
});
