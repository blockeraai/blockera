import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Font Color → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('simple value', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-btn').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear({ force: true });
			cy.get('input[maxlength="9"]').type('70ca9e', { delay: 0 });
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'color',
			'rgb(112, 202, 158)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('#70ca9e').to.be.equal(
				getSelectedBlock(data, 'blockeraFontColor')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'color',
			'rgb(112, 202, 158)'
		);
	});

	it('Variable value', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contrast');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', 'color: var(--wp--preset--color--contrast)');
		});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Contrast',
					id: 'contrast',
					value: '#111111',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--contrast',
				},
				name: 'Contrast',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFontColor'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				!enabledOptimizeStyleGeneration
					? 'color: var(--wp--preset--color--contrast) !important'
					: 'color: var(--wp--preset--color--contrast)'
			);
	});
});
