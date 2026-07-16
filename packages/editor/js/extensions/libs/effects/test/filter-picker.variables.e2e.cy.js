/**
 * Blockera dependencies
 */
import {
	assertVariablePickerPresetHoverPreview,
	createPost,
	expectBlockAttrIncludesPresetVar,
	filterVariablePickerSearch,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesFiltersScreen,
	openRepeaterHeaderVariablePicker,
	redirectToFrontPage,
	resetAndSaveGlobalStylesEntityRecord,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles filter preset → value addon (Filters)', () => {
	const presetName = 'E2E Filter';
	const slug = 'e-2-e-filter';
	const addDataTest = 'global-styles-preset-add-filter-preset-presets-custom';

	afterEach(() => {
		resetAndSaveGlobalStylesEntityRecord();
	});

	function seedFilterPreset() {
		openGlobalStylesFiltersScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('previews the filter preset on the selected block while hovering the picker row, then clears it on mouse leave', () => {
		seedFilterPreset();

		createPost();

		cy.getBlock('default').type('Hover preview filter paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Filters');

		filterVariablePickerSearch(presetName);

		assertVariablePickerPresetHoverPreview({
			slug,
			cssNeedle: 'blur(3px)',
		});
	});

	it('applies the custom filter preset', () => {
		seedFilterPreset();

		createPost();

		cy.getBlock('default').type('Filter preset paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Filters');

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--filter--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraFilter', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when blur is edited in global styles after picking it', () => {
		seedFilterPreset();

		createPost();

		cy.getBlock('default').type('Filter edit paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Filters');
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesFiltersScreen({ reset: false });

		cy.getByDataCy('filter-preset-repeater-item-header')
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
				cy.getByDataTest('filter-blur-input').clear({ force: true });
				cy.getByDataTest('filter-blur-input').type('9', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--filter--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--filter--${slug}`);

		cy.get('.blockera-block')
			.invoke('css', 'filter')
			.should('match', /blur/);
	});
});
