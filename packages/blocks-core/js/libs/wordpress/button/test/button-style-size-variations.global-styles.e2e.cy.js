/**
 * E2E: core/button style + size variations — global styles panel, post editor, and front end.
 *
 * Size variations are seeded via wp.data (see helpers) before the global styles panel opens,
 * not via PHP / register_block_style.
 */
import {
	addBlockToPost,
	createPost,
	savePage,
	saveSiteEditorDirtyEntities,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';
import {
	STYLE_VARIATION_SLUG,
	CUSTOMIZED_SIZE_BG_HEX,
	CUSTOMIZED_SIZE_BG_RGB,
	openButtonBlockGlobalStylesVariations,
	assertSizeVariationsRenderedInGlobalStyles,
	assertStyleVariationsRenderedInGlobalStyles,
	selectSizeVariationInGlobalStyles,
	selectStyleVariationInGlobalStyles,
	customizeStyleVariationBorder,
	assertCustomizedSizeVariationInStore,
	openSizeVariationPickerInInspector,
	openStyleVariationPickerInInspector,
	pickVariationInInspectorPopover,
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
		// 2. Customize one size variation and verify store + entity record
		//
		selectSizeVariationInGlobalStyles('e2e-size-small');

		cy.setColorControlValue('BG Color', CUSTOMIZED_SIZE_BG_HEX.slice(1));

		assertCustomizedSizeVariationInStore(CUSTOMIZED_SIZE_BG_HEX);

		//
		// 2b. Customize a style variation (fill) for combined style + size coverage
		//
		selectStyleVariationInGlobalStyles(STYLE_VARIATION_SLUG);
		customizeStyleVariationBorder();

		saveSiteEditorDirtyEntities();

		//
		// 3. Post editor → settings tab → insert core/button → pick customized size
		//
		createPost();

		cy.getByDataTest('settings-tab').click();

		addBlockToPost('core/button', true);

		cy.getBlock('core/button').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		openSizeVariationPickerInInspector();
		pickVariationInInspectorPopover('e2e-size-small');

		cy.getByDataTest('style-variations-button')
			.filter('.is-variation-ui-size')
			.find('[data-test="style-variations-button-label"]')
			.should('contain', 'E2E Size Small');

		assertButtonLinkEditorCss({
			backgroundColor: CUSTOMIZED_SIZE_BG_RGB,
		});

		//
		// 4. Apply style variation alongside size in the block editor
		//
		openStyleVariationPickerInInspector();
		pickVariationInInspectorPopover(STYLE_VARIATION_SLUG);

		cy.get('[data-test="style-variations-button"]')
			.not('.is-variation-ui-size')
			.find('[data-test="style-variations-button-label"]')
			.should('contain', 'Fill');

		cy.getBlock('core/button')
			.first()
			.should('have.class', `is-style-${STYLE_VARIATION_SLUG}`)
			.should('have.class', 'is-size-e2e-size-small');

		assertButtonLinkEditorCss({
			backgroundColor: CUSTOMIZED_SIZE_BG_RGB,
			border: '5px dashed rgb(55, 230, 212)',
		});

		//
		// 5. Save and verify front page: size + style variation CSS and classes
		//
		savePage();
		redirectToFrontPage();

		assertButtonLinkFrontCss({
			backgroundColor: CUSTOMIZED_SIZE_BG_RGB,
			border: '5px dashed rgb(55, 230, 212)',
		});

		cy.get(`.is-size-e2e-size-small`).should('exist');
		cy.get(`.is-style-${STYLE_VARIATION_SLUG}`).should('exist');
	});
});
