/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesTransitionsScreen,
	openRepeaterHeaderVariablePicker,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles transition preset → value addon (Transitions Timing)', () => {
	const presetName = 'E2E Transition';
	/** Matches `normalizeVariablePresetSlug` for the preset display name (kebab-case + `separateNumbers`). */
	const slug = 'e-2-e-transition';
	const addDataTest =
		'global-styles-preset-add-transition-preset-presets-custom';

	function seedTransitionPreset() {
		openGlobalStylesTransitionsScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom transition preset', () => {
		seedTransitionPreset();

		createPost();

		cy.getBlock('default').type('Transition preset paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker(['Transitions Timing', 'Transitions']);

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--transition--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraTransition', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when duration is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Transition edit paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		openRepeaterHeaderVariablePicker(['Transitions Timing', 'Transitions']);
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesTransitionsScreen({ reset: false });

		cy.getByDataCy('transition-preset-repeater-item-header')
			.last()
			.click({ force: true });

		cy.get('.blockera-component-popover').within(() => {
			cy.getByDataCy('group-control-header')
				.find('.blockera-control-repeater-group-header')
				.click({ force: true });

			cy.getByDataTest('transition-input-duration').clear({
				force: true,
			});
			cy.getByDataTest('transition-input-duration').type('800', {
				delay: 0,
				force: true,
			});
		});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--transition--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--transition--${slug}`);

		cy.get('.blockera-block').should(
			'have.css',
			'transition-duration',
			'0.8s'
		);
	});
});
