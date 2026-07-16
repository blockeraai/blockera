/**
 * Blockera dependencies
 */
import {
	assertVariablePickerPresetHoverPreview,
	createPost,
	expectBlockAttrIncludesPresetVar,
	filterVariablePickerSearch,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesShadowsScreen,
	openRepeaterHeaderVariablePicker,
	redirectToFrontPage,
	resetAndSaveGlobalStylesEntityRecord,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles box-shadow preset → value addon (Box Shadows)', () => {
	const presetName = 'E2E Shadow';
	const slug = 'e-2-e-shadow';
	const addDataTest = 'global-styles-preset-add-shadow-preset-presets-custom';

	afterEach(() => {
		resetAndSaveGlobalStylesEntityRecord();
	});

	function seedShadowPreset() {
		openGlobalStylesShadowsScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('previews the shadow preset on the selected block while hovering the picker row, then clears it on mouse leave', () => {
		seedShadowPreset();

		createPost();

		cy.getBlock('default').type('Hover preview shadow paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Box Shadows');

		filterVariablePickerSearch(presetName);

		assertVariablePickerPresetHoverPreview({
			slug,
			cssNeedle: '10px 10px 10px 0px',
			blockCssProperty: 'box-shadow',
			blockCssValue: 'rgba(0, 0, 0, 0.67) 10px 10px 10px 0px',
		});
	});

	it('applies the custom shadow preset via the repeater variable picker', () => {
		seedShadowPreset();

		createPost();

		cy.getBlock('default').type('Shadow preset paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Box Shadows');

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--shadow--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraBoxShadow', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when the shadow offset is edited in global styles after picking it', () => {
		seedShadowPreset();

		createPost();

		cy.getBlock('default').type('Shadow preset edit paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Box Shadows');
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesShadowsScreen({ reset: false });

		cy.getByDataCy('shadow-preset-repeater-item-header')
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
				cy.getByDataTest('box-shadow-x-input').clear({ force: true });
				cy.getByDataTest('box-shadow-x-input').type('22', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--shadow--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--shadow--${slug}`);

		cy.get('.blockera-block').should(
			'have.css',
			'box-shadow',
			'rgba(0, 0, 0, 0.67) 22px 10px 10px 0px'
		);
	});
});
