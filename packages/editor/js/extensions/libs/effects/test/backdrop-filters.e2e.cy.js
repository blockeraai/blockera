import {
	savePage,
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Backdrop Filters → Functionality', () => {
	beforeEach(() => {
		createPost();
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('Should update filter correctly, when add one drop-shadow', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
		cy.getParentContainer('Backdrop Filters').as('filters');

		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Backdrop Filter').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getParentContainer('Type').within(() => {
					cy.get('select').select('drop-shadow');
				});

				cy.getByDataTest('filter-drop-shadow-x-input').clear();
				cy.getByDataTest('filter-drop-shadow-x-input').type(50);

				cy.getByDataTest('filter-drop-shadow-y-input').clear();
				cy.getByDataTest('filter-drop-shadow-y-input').type(30);

				cy.getByDataTest('filter-drop-shadow-blur-input').clear();
				cy.getByDataTest('filter-drop-shadow-blur-input').type(40);

				cy.getByDataTest('filter-drop-shadow-color').click();
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('cccccc', { delay: 0 });
			});

		// Check block
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'backdrop-filter: drop-shadow(50px 30px 40px #cccccc)'
				);
		});

		// Check store
		getWPDataObject().then((data) => {
			expect({
				'drop-shadow-0': {
					isVisible: true,
					type: 'drop-shadow',
					'drop-shadow-x': '50px',
					'drop-shadow-y': '30px',
					'drop-shadow-blur': '40px',
					'drop-shadow-color': '#cccccc',
					order: 0,
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBackdropFilter')
			);
		});

		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Backdrop Filter').click();
		});

		// promotion popover should not appear
		cy.get('.blockera-component-promotion-popover').should('exist');

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				!enabledOptimizeStyleGeneration
					? 'backdrop-filter: drop-shadow(50px 30px 40px #cccccc) !important;'
					: 'backdrop-filter: drop-shadow(50px 30px 40px #cccccc)'
			);
	});

	it('Multiple filters', () => {
		appendBlocks(`<!-- wp:paragraph {"blockeraPropsId":"838730d7-a050-434e-9c14-9ac2a4b7deda","blockeraCompatId":"109171552854","blockeraBackdropFilter":{"value":{"brightness-0":{"isVisible":true,"type":"brightness","brightness":"100%","order":0},"invert-0":{"isVisible":true,"type":"invert","invert":"50%","order":1},"blur-0":{"isVisible":true,"type":"blur","blur":"3px","order":2}}},"className":"blockera-block blockera-block\u002d\u002dmv6yv4"} -->
<p class="blockera-block blockera-block--mv6yv4">This is test paragraph</p>
<!-- /wp:paragraph -->`);

		cy.getBlock('core/paragraph').click();
		cy.getByDataTest('style-tab').click();
		cy.getParentContainer('Backdrop Filters').as('filters');

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'backdrop-filter',
			'brightness(1) invert(0.5) blur(3px)'
		);

		// Check store
		getWPDataObject().then((data) => {
			expect({
				'brightness-0': {
					isVisible: true,
					type: 'brightness',
					brightness: '100%',
					order: 0,
				},
				'invert-0': {
					isVisible: true,
					type: 'invert',
					invert: '50%',
					order: 1,
				},
				'blur-0': {
					isVisible: true,
					type: 'blur',
					blur: '3px',
					order: 2,
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBackdropFilter')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('p.blockera-block').should(
			'have.css',
			'backdrop-filter',
			'brightness(1) invert(0.5) blur(3px)'
		);
	});
});
