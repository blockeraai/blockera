/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesTransformsScreen,
	openRepeaterHeaderVariablePicker,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles transform preset → value addon (Transforms)', () => {
	const presetName = 'E2E Transform';
	const slug = 'e-2-e-transform';
	const addDataTest =
		'global-styles-preset-add-transform-preset-presets-custom';

	function seedTransformPreset() {
		openGlobalStylesTransformsScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom transform preset', () => {
		seedTransformPreset();

		createPost();

		cy.getBlock('default').type('Transform preset paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker(
			'Transforms',
			'blockera-repeater-control'
		);

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--transform--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraTransform', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when move-x is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Transform edit paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker(['Transforms']);
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesTransformsScreen({ reset: false });

		cy.getByDataCy('transform-preset-repeater-item-header')
			.last()
			.click({ force: true });

		cy.get('.blockera-component-popover', { timeout: 15000 })
			.should('be.visible')
			.within(() => {
				cy.getByDataCy('group-control-header')
					.find('.blockera-control-repeater-group-header')
					.click({ force: true });
			});

		cy.get('.blockera-component-popover')
			.eq(1)
			.within(() => {
				cy.getByAriaLabel('Move-X').clear({ force: true });
				cy.getByAriaLabel('Move-X').type('12', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--transform--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--transform--${slug}`);
	});
});
