/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesTextShadowsScreen,
	openMoreFeaturesControl,
	openRepeaterHeaderVariablePicker,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles text-shadow preset → value addon (Text Shadows)', () => {
	const presetName = 'E2E Txt Shadow';
	const slug = 'e-2-e-txt-shadow';
	const addDataTest =
		'global-styles-preset-add-text-shadow-preset-presets-custom';

	function seedTextShadowPreset() {
		openGlobalStylesTextShadowsScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom text-shadow preset', () => {
		seedTextShadowPreset();

		createPost();

		cy.getBlock('default').type('Text shadow preset paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openMoreFeaturesControl('More typography settings');

		openRepeaterHeaderVariablePicker('Text Shadows');

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--text-shadow--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraTextShadow', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when blur is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Text shadow edit paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openMoreFeaturesControl('More typography settings');

		openRepeaterHeaderVariablePicker('Text Shadows');
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesTextShadowsScreen({ reset: false });

		cy.getByDataCy('text-shadow-preset-repeater-item-header')
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
				cy.getByAriaLabel('Blur Effect').clear({ force: true });
				cy.getByAriaLabel('Blur Effect').type('8', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--text-shadow--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--text-shadow--${slug}`);

		cy.get('.blockera-block').should(
			'have.css',
			'text-shadow',
			'rgba(0, 0, 0, 0.67) 1px 1px 8px'
		);
	});
});
