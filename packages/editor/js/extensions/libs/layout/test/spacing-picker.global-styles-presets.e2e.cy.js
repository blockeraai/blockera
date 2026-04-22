/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesSpacingScreen,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
	setBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles spacing preset → value addon (margin-top)', () => {
	const presetName = 'E2E Spacing';
	/** Matches `normalizeVariablePresetSlug` for the preset display name. */
	const slug = 'e-2-e-spacing';
	const addDataTest = 'global-styles-preset-add-spacing-size-presets-custom';
	const defaultFallback = '20px';

	function seedSpacingPreset() {
		openGlobalStylesSpacingScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom preset: editor CSS, block data, and front use the spacing variable', () => {
		seedSpacingPreset();

		const expectedDecl = `margin-top: var(--wp--preset--spacing--${slug}, ${defaultFallback})`;

		createPost();

		cy.getBlock('default').type('Spacing preset paragraph.', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		setBoxSpacingSide('margin-top', slug, true);

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedDecl);
		});

		expectBlockAttrIncludesPresetVar(
			'blockeraSpacing',
			`--wp--preset--spacing--${slug}`
		);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedDecl);
	});

	it('updates generated CSS when the preset size is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Spacing preset edit paragraph.', {
			delay: 0,
		});
		cy.getByDataTest('style-tab').click();

		setBoxSpacingSide('margin-top', slug, true);

		savePage();

		openGlobalStylesSpacingScreen({ reset: false });

		cy.getByDataCy('spacing-size-repeater-item-header')
			.last()
			.click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('spacing-size-input').clear({ force: true });
				cy.getByDataTest('spacing-size-input').type('33px', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		const expectedDecl = `margin-top: var(--wp--preset--spacing--${slug}, 33px)`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedDecl);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				`margin-top: var(--wp--preset--spacing--${slug})`
			);

		cy.get('.blockera-block').should('have.css', 'margin-top', '33px');
	});
});
