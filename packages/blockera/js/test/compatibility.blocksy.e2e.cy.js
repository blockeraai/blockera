import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';
import { withinVariablePickerPopover } from '@blockera/dev-cypress/js/helpers/variable-picker';

describe('Compatibility with Blocksy Theme', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();
	});

	it('Color variables', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		withinVariablePickerPopover(() => {
			cy.contains('Blocksy Color Variables').should('exist');

			cy.contains('Color Variables').should('exist');
			cy.contains('Color variables').should('not.exist');

			cy.contains('No default variable.').should('not.exist');
			cy.contains('Black').should('not.exist');
			cy.contains('Vivid red').should('not.exist');

			cy.contains('Custom variables').should('exist');
			cy.getByDataTest('variable-picker-section-add-color').should(
				'exist'
			);
		});

		cy.selectValueAddonItem('link-initial-color');

		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataTest('value-addon-normal').click({ force: true });
		});

		withinVariablePickerPopover(() => {
			cy.get(
				'[data-cy="control-group"].is-selected-item [data-variable-slug="link-initial-color"]'
			).should('exist');
		});

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'color: var(--theme-link-initial-color, var(--theme-palette-color-1, #2872fa))'
				);
		});

		assertBlockData((data) => {
			expect({
				settings: {
					name: 'Link',
					id: 'link-initial-color',
					value: 'var(--theme-palette-color-1, #2872fa)',
					type: 'color',
					group: 'blocksy-colors',
					var: '--theme-link-initial-color',
					label: 'Link',
					reference: {
						type: 'theme',
						theme: 'blocksy',
					},
				},
				name: 'Link',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFontColor'));
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				'color: var(--theme-link-initial-color, var(--theme-palette-color-1, #2872fa))'
			);
	});

	it('Width Size variables', () => {
		cy.getParentContainer('Width').within(() => {
			cy.openValueAddon();
		});

		withinVariablePickerPopover(() => {
			cy.contains('Blocksy Width Size Variables').should('exist');
		});

		cy.selectValueAddonItem('normal-container-max-width');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'width: var(--theme-normal-container-max-width, 1290px)'
				);
		});

		assertBlockData((data) => {
			expect({
				settings: {
					name: 'Normal Container',
					id: 'normal-container-max-width',
					value: '1290px',
					type: 'width-size',
					group: 'blocksy-width-size',
					var: '--theme-normal-container-max-width',
					label: 'Normal Container Max Width',
					reference: {
						type: 'theme',
						theme: 'blocksy',
					},
				},
				name: 'Normal Container',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraWidth'));
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				'width: var(--theme-normal-container-max-width, 1290px)'
			);
	});
});
