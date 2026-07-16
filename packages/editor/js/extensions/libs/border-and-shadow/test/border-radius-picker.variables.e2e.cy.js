/**
 * Blockera dependencies
 */
import {
	assertVariablePickerPresetHoverPreview,
	createPost,
	expectBlockAttrIncludesPresetVar,
	filterVariablePickerSearch,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesBorderRadiusScreen,
	redirectToFrontPage,
	resetAndSaveGlobalStylesEntityRecord,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles border-radius preset → value addon (Radius)', () => {
	const presetName = 'E2E Radius';
	const slug = 'e-2-e-radius';
	const addDataTest = 'global-styles-preset-add-border-radius-presets-custom';
	const defaultFallback = '4px';

	afterEach(() => {
		resetAndSaveGlobalStylesEntityRecord();
	});

	function seedRadiusPreset() {
		openGlobalStylesBorderRadiusScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('previews the border-radius preset on the selected block while hovering the picker row, then clears it on mouse leave', () => {
		seedRadiusPreset();

		createPost();

		cy.getBlock('default').type('Hover preview radius paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Radius').within(() => {
			cy.openValueAddon();
		});

		filterVariablePickerSearch(presetName);

		assertVariablePickerPresetHoverPreview({
			slug,
			cssNeedle: `border-radius: ${defaultFallback}`,
			blockCssProperty: 'border-radius',
			blockCssValue: defaultFallback,
		});
	});

	it('applies the custom border-radius preset', () => {
		seedRadiusPreset();

		const expectedDecl = `border-radius: var(--wp--preset--border-radius--${slug}, ${defaultFallback})`;

		createPost();

		cy.getBlock('default').type('Radius preset paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Radius').within(() => {
			cy.openValueAddon();
		});

		cy.selectValueAddonItem(slug);

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedDecl);
		});

		expectBlockAttrIncludesPresetVar(
			'blockeraBorderRadius',
			`--wp--preset--border-radius--${slug}`
		);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedDecl);
	});

	it('updates generated CSS when the radius size is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Radius preset edit paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Radius').within(() => {
			cy.openValueAddon();
		});
		cy.selectValueAddonItem(slug);

		savePage();

		cy.get('.blockera-preview-button-wrapper a')
			.invoke('attr', 'href')
			.then((postUrl) => {
				openGlobalStylesBorderRadiusScreen({ reset: false });

				cy.contains(
					'.blockera-border-radius-presets [data-cy="border-radius-preset-repeater-item-header"]',
					presetName
				).click({ force: true });

				cy.get('.components-popover')
					.filter(':visible')
					.last()
					.within(() => {
						cy.getByDataTest('border-radius-size-input').clear({
							force: true,
						});
						cy.getByDataTest('border-radius-size-input').type(
							'12px',
							{
								delay: 0,
								force: true,
							}
						);
					});

				cy.realPress('Escape');

				saveSiteEditorDirtyEntities();

				cy.visit(postUrl);

				cy.get('style#global-styles-inline-css')
					.invoke('text')
					.should(
						'match',
						new RegExp(
							`--wp--preset--border-radius--${slug}:\\s*12px`
						)
					);

				cy.get('style#blockera-inline-css')
					.invoke('text')
					.should('include', `--wp--preset--border-radius--${slug}`);

				cy.contains('Radius preset edit paragraph.')
					.closest('.blockera-block')
					.should('have.css', 'border-radius', '12px');
			});
	});
});
