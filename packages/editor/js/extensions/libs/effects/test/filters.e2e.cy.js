import {
	savePage,
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Filters → Functionality', () => {
	beforeEach(() => {
		createPost();
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('Should update filter correctly, when add one drop-shadow', () => {
		cy.getBlock('default').type('This is test paragraph', {
			delay: 0,
		});
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Filters').as('filters');

		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Filter Effect').click();
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

		//Check block
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'filter: drop-shadow(50px 30px 40px #cccccc)'
				);
		});

		//Check store
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFilter'));
		});

		/* try to add another filter */
		cy.get('@filters').within(() => {
			cy.get('[aria-label="Add New Filter Effect"]').click({
				force: true,
			});
		});

		// promotion popover should appear
		cy.get('.blockera-component-promotion-popover').should('exist');

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				!enabledOptimizeStyleGeneration
					? 'filter: drop-shadow(50px 30px 40px #cccccc) !important;'
					: 'filter: drop-shadow(50px 30px 40px #cccccc)'
			);
	});

	it('Multiple filters + promoter', () => {
		appendBlocks(`<!-- wp:paragraph {"blockeraPropsId":"74ae4cb7-f8c2-4aaa-8886-c3a525d59089","blockeraCompatId":"10918152377","blockeraFilter":{"value":{"brightness-0":{"isVisible":true,"type":"brightness","brightness":"100%","order":0},"invert-0":{"isVisible":true,"type":"invert","invert":"50%","order":1}}},"className":"blockera-block blockera-block\u002d\u002d7zhhq5"} -->
<p class="blockera-block blockera-block--7zhhq5">This is test paragraph</p>
<!-- /wp:paragraph -->`);

		cy.getBlock('core/paragraph').click();
		cy.getByDataTest('style-tab').click();
		cy.getParentContainer('Filters').as('filters');

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'filter',
			'brightness(1) invert(0.5)'
		);

		//Check store
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFilter'));
		});

		return;

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'filter',
			'brightness(1) invert(0.5) blur(3px)'
		);
	});
});
