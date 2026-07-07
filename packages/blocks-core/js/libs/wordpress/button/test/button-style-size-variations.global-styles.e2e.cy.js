/**
 * E2E: core/button style + size variations — global styles panel, post editor, and front end.
 *
 * Size variations are seeded via wp.data (see helpers) before the global styles panel opens,
 * not via PHP / register_block_style.
 */
import {
	appendBlocks,
	createPostClearingZoomStorage,
	savePage,
	saveSiteEditorDirtyEntities,
	redirectToFrontPage,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';
import {
	STYLE_VARIATION_SLUG,
	CUSTOMIZED_SIZE_FONT_SIZE,
	CUSTOMIZED_SIZE_VARIATION_SLUG,
	openButtonBlockGlobalStylesVariations,
	assertSizeVariationsRenderedInGlobalStyles,
	assertStyleVariationsRenderedInGlobalStyles,
	selectStyleVariationInGlobalStyles,
	customizeSizeVariationFontSize,
	customizeStyleVariationBorder,
	assertCustomizedSizeVariationInStore,
	closeSizeVariationBlockCardInGlobalStyles,
	persistSizeVariationFontSizeInStore,
	persistStyleVariationBorderInStore,
	seedButtonSizeVariationsInStore,
	openStyleVariationPickerInInspector,
	assertButtonLinkEditorCss,
	assertButtonLinkFrontCss,
} from './button-style-size-variations-helpers';

describe('core/button → style & size variations (Global Styles → editor → front)', () => {
	it('covers size/style global styles, store sync, block editor CSS, and front page', () => {
		//
		// 1. Site Editor → seed size variations in store → Global Styles → Button
		//
		openButtonBlockGlobalStylesVariations();

		assertSizeVariationsRenderedInGlobalStyles();
		assertStyleVariationsRenderedInGlobalStyles();

		//
		// 2. Customize a non-default size variation and verify store + entity record
		//
		customizeSizeVariationFontSize();

		assertCustomizedSizeVariationInStore(CUSTOMIZED_SIZE_FONT_SIZE);

		closeSizeVariationBlockCardInGlobalStyles();

		//
		// 2b. Customize a style variation (fill) for combined style + size coverage
		//
		selectStyleVariationInGlobalStyles(STYLE_VARIATION_SLUG);
		customizeStyleVariationBorder();

		saveSiteEditorDirtyEntities();

		//
		// 3. Post editor → settings tab → insert core/button → pick customized size
		//
		createPostClearingZoomStorage();
		closeWelcomeGuide();

		// Re-hydrate size variation rows for the post editor session (saved via site editor above).
		seedButtonSizeVariationsInStore();
		persistSizeVariationFontSizeInStore(CUSTOMIZED_SIZE_FONT_SIZE);
		persistStyleVariationBorderInStore(STYLE_VARIATION_SLUG);

		appendBlocks(`<!-- wp:button {"className":"is-size-${CUSTOMIZED_SIZE_VARIATION_SLUG} is-style-fill"} -->
<div class="wp-block-button is-size-${CUSTOMIZED_SIZE_VARIATION_SLUG} is-style-fill"><a class="wp-block-button__link wp-element-button">button</a></div>
<!-- /wp:button -->`);

		cy.getBlock('core/button').first().click();

		cy.getByAriaControls('settings-view', { timeout: 30000 }).click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		assertButtonLinkEditorCss({
			fontSize: CUSTOMIZED_SIZE_FONT_SIZE,
			border: '5px dashed rgb(55, 230, 212)',
		});

		//
		// 4. Style variation picker reflects the fill style alongside size
		//
		openStyleVariationPickerInInspector();

		cy.get('[data-test="style-variations-button"]')
			.not('.is-variation-ui-size')
			.find('[data-test="style-variations-button-label"]')
			.should('contain', 'Fill');

		cy.getBlock('core/button')
			.first()
			.should('have.class', `is-style-${STYLE_VARIATION_SLUG}`)
			.should('have.class', `is-size-${CUSTOMIZED_SIZE_VARIATION_SLUG}`);

		//
		// 5. Save and verify front page: size + style variation CSS and classes
		//
		savePage();
		redirectToFrontPage();

		assertButtonLinkFrontCss({
			fontSize: CUSTOMIZED_SIZE_FONT_SIZE,
			border: '5px dashed rgb(55, 230, 212)',
		});

		cy.get('.entry-content .wp-block-button')
			.first()
			.should(($button) => {
				const classes = $button.attr('class') || '';

				expect(classes).to.match(
					new RegExp(
						`\\bis-size-${CUSTOMIZED_SIZE_VARIATION_SLUG}(?:--\\d+)?\\b`
					)
				);
			});
	});
});
