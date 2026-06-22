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
import { clickVariablePickerHeaderAddCustomVariable } from '@blockera/dev-cypress/js/helpers/variable-picker';

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

	it('seeds a new custom transform preset from the current block transform value', function () {
		createPost();

		cy.getBlock('default').type('Transform seed paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Transforms', 'blockera-repeater-control')
			.should('exist')
			.within(() => {
				cy.getByAriaLabel('Add New Transform').click({ force: true });
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('[aria-label="Move-X"]').clear({
					force: true,
					waitForAnimations: false,
				});
				cy.get('[aria-label="Move-X"]').type('15', {
					force: true,
					waitForAnimations: false,
				});
			});

		cy.realPress('Escape');

		openRepeaterHeaderVariablePicker('Transforms');

		cy.get('body').then(function ($body) {
			const canAddCustom = $body.find(
				'[data-test="variable-picker-header-add-custom-variable"]:visible'
			).length;

			if (!canAddCustom) {
				this.skip();
			}
		});

		clickVariablePickerHeaderAddCustomVariable();

		cy.get('.blockera-component-popover', { timeout: 15000 })
			.filter(':visible')
			.last()
			.should('be.visible')
			.within(() => {
				cy.getByAriaLabel('Move-X').should('have.value', '15px');
			});
	});

	it('applies the custom transform preset', () => {
		seedTransformPreset();

		createPost();

		cy.getBlock('default').type('Transform preset paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker('Transforms');

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

		openRepeaterHeaderVariablePicker('Transforms');
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
