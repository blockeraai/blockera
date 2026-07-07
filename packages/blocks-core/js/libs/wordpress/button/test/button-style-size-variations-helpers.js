/**
 * Shared Cypress helpers for core/button style + size variation E2E flows.
 *
 * Size variations are seeded via the JS data stores (not PHP / register_block_style),
 * because size metadata keys such as `blockeraVariationType` cannot be passed through
 * the WordPress `register_block_style` API.
 */
import {
	closeWelcomeGuide,
	openSiteEditor,
} from '@blockera/dev-cypress/js/helpers';

/** Matches `VARIATION_SURFACE_SIZE` in the editor package. */
const VARIATION_SURFACE_SIZE = 'size';
const BLOCK_NAME = 'core/button';

export const SIZE_VARIATION_SLUGS = ['e2e-size-small', 'e2e-size-large'];

export const SIZE_VARIATION_DEFINITIONS = [
	{
		name: 'e2e-size-small',
		label: 'E2E Size Small',
		blockeraIsDefaultVariation: true,
	},
	{
		name: 'e2e-size-large',
		label: 'E2E Size Large',
		blockeraIsDefaultVariation: false,
	},
];

/** WordPress core/button style variation (registered by core). */
export const STYLE_VARIATION_SLUG = 'fill';

/** Global styles dual-surface layout (Blockera portal + native WP panel siblings). */
export const GLOBAL_STYLES_PANEL_STACK = '.blockera-global-styles-panel-stack';
export const GLOBAL_STYLES_SIZE_ASIDE = '.blockera-global-styles-panel-aside';

/**
 * Keep nodes rendered in the style column (exclude the size-variation aside).
 *
 * @param {Cypress.ObjectLike} $elements Matched elements from a Cypress query.
 * @return {Cypress.ObjectLike} Filtered elements outside the size aside.
 */
export function filterStyleColumnElements($elements) {
	return $elements.filter((_, element) => {
		return !element.closest(GLOBAL_STYLES_SIZE_ASIDE);
	});
}
/** Default size variation slug (shared block root — not used for scoped font-size CSS). */
export const DEFAULT_SIZE_VARIATION_SLUG = 'e2e-size-small';

/** Non-default size variation customized with a distinct font size in global styles. */
export const CUSTOMIZED_SIZE_VARIATION_SLUG = 'e2e-size-large';

/** Distinct font size applied to {@link CUSTOMIZED_SIZE_VARIATION_SLUG} in global styles. */
export const CUSTOMIZED_SIZE_FONT_SIZE = '18px';

export const CUSTOMIZED_STYLE_BORDER_VALUE = {
	type: 'all',
	all: {
		width: '5px',
		style: 'dashed',
		color: '#37e6d4',
	},
};

/**
 * @param {Window} win
 * @return {string|number|undefined} The global styles entity ID.
 */
export function getGlobalStylesEntityId(win) {
	const coreSelect = win.wp?.data?.select('core');

	if (!coreSelect) {
		return undefined;
	}

	if (
		typeof coreSelect.__experimentalGetCurrentGlobalStylesId === 'function'
	) {
		return coreSelect.__experimentalGetCurrentGlobalStylesId();
	}

	if (typeof coreSelect.getCurrentGlobalStylesId === 'function') {
		return coreSelect.getCurrentGlobalStylesId();
	}

	return undefined;
}

/**
 * Seeds button size variations into core global-styles + blockera/editor stores.
 * Call after `openSiteEditor()` and before opening the global styles panel.
 *
 * Mirrors the persistence shape from `add-new-style-modal.js` (size branch).
 */
export function seedButtonSizeVariationsInStore() {
	cy.window({ timeout: 30000 }).should((win) => {
		const registry = win.wp?.data;

		if (!registry) {
			expect.fail('wp.data is not available');
		}

		const coreSelect = registry.select('core');
		const coreDispatch = registry.dispatch('core');
		const blockeraSelect = registry.select('blockera/editor');
		const blockeraDispatch = registry.dispatch('blockera/editor');

		if (!coreSelect || !coreDispatch || !blockeraDispatch) {
			expect.fail('Required stores are not available');
		}

		const gsId = getGlobalStylesEntityId(win);

		expect(gsId, 'global styles entity id').to.not.equal(undefined);
		expect(gsId, 'global styles entity id').to.not.equal(null);

		const record = coreSelect.getEditedEntityRecord(
			'root',
			'globalStyles',
			gsId
		);

		const styles = { ...(record?.styles || {}) };
		const blocks = { ...(styles.blocks || {}) };
		const buttonBlock = { ...(blocks[BLOCK_NAME] || {}) };
		const variations = { ...(buttonBlock.variations || {}) };

		const existingMeta =
			blockeraSelect?.getBlockeraGlobalStylesMetaData?.() ||
			win.blockeraGlobalStylesMetaData ||
			record?.blockeraMetaData ||
			{};
		const metaBlocks = { ...(existingMeta.blocks || {}) };
		const metaButton = { ...(metaBlocks[BLOCK_NAME] || {}) };
		const metaVariations = { ...(metaButton.variations || {}) };

		SIZE_VARIATION_DEFINITIONS.forEach((definition) => {
			const { name, label, blockeraIsDefaultVariation } = definition;

			const persistedVariation = {
				blockeraVariationType: VARIATION_SURFACE_SIZE,
				blockeraIsDefaultVariation,
			};

			const metaRow = {
				name,
				label,
				icon: {
					name: 'blockera',
					library: 'blockera',
				},
				blockeraVariationType: VARIATION_SURFACE_SIZE,
				blockeraIsDefaultVariation,
			};

			variations[name] = {
				...(variations[name] || {}),
				...persistedVariation,
			};
			metaVariations[name] = {
				...(metaVariations[name] || {}),
				...metaRow,
			};

			blockeraDispatch.setStyleVariationBlocks(
				name,
				[BLOCK_NAME],
				'manual'
			);
		});

		buttonBlock.variations = variations;
		blocks[BLOCK_NAME] = buttonBlock;
		styles.blocks = blocks;

		const blockeraMetaData = {
			...existingMeta,
			blocks: {
				...metaBlocks,
				[BLOCK_NAME]: {
					...metaButton,
					variations: metaVariations,
				},
			},
		};

		coreDispatch.editEntityRecord('root', 'globalStyles', gsId, {
			styles,
			blockeraMetaData,
		});

		if (blockeraDispatch.setBlockeraGlobalStylesMetaData) {
			blockeraDispatch.setBlockeraGlobalStylesMetaData(blockeraMetaData);
		}

		win.blockeraGlobalStylesMetaData = blockeraMetaData;
	});

	cy.window().should((win) => {
		const data = win.wp?.data;
		const gsId = getGlobalStylesEntityId(win);
		const edited = data
			.select('core')
			.getEditedEntityRecord('root', 'globalStyles', gsId);

		SIZE_VARIATION_SLUGS.forEach((slug) => {
			const entry =
				edited?.styles?.blocks?.[BLOCK_NAME]?.variations?.[slug];

			expect(
				entry?.blockeraVariationType,
				`seeded size variation ${slug}`
			).to.equal(VARIATION_SURFACE_SIZE);
		});
	});
}

export function openButtonBlockGlobalStylesVariations() {
	openSiteEditor();
	seedButtonSizeVariationsInStore();
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').click();
	cy.get('button[id="/blocks/core%2Fbutton"]').first().click({ force: true });
}

/**
 * Size variations render in the aside global-styles stack.
 */
export function withinSizeVariationsPanel(callback) {
	return cy
		.get('.blockera-global-styles-panel-aside', { timeout: 20000 })
		.should('be.visible')
		.within(callback);
}

/**
 * Style-column queries inside the global-styles stack.
 *
 * Cypress `.within()` requires a single element. Blockera + the WP panel override
 * flatten many DOM siblings under the stack (placeholder, block card, variations,
 * native chrome). Scope to the stack, then exclude `.blockera-global-styles-panel-aside`
 * in each query via {@link filterStyleColumnElements}.
 */
export function withinStyleVariationsPanel(callback) {
	return cy
		.get(GLOBAL_STYLES_PANEL_STACK, { timeout: 20000 })
		.should('be.visible')
		.within(callback);
}

export function assertSizeVariationsRenderedInGlobalStyles() {
	withinSizeVariationsPanel(() => {
		SIZE_VARIATION_SLUGS.forEach((slug) => {
			cy.getByDataTest(`style-${slug}`, { timeout: 20000 }).should(
				'be.visible'
			);
		});
	});
}

export function assertStyleVariationsRenderedInGlobalStyles() {
	withinStyleVariationsPanel(() => {
		// Core ships fill + outline for buttons; assert the primary style surface rows exist.
		['fill', 'outline'].forEach((slug) => {
			cy.getByDataTest(`style-${slug}`, { timeout: 20000 })
				.then(filterStyleColumnElements)
				.should('exist');
		});
	});
}

export function selectSizeVariationInGlobalStyles(slug) {
	withinSizeVariationsPanel(() => {
		cy.getByDataTest(`style-${slug}`).first().click({ force: true });
	});
}

export function closeSizeVariationBlockCardInGlobalStyles() {
	cy.getByDataTest('Close Size Variation').click({ force: true });
}

export function selectStyleVariationInGlobalStyles(slug) {
	withinStyleVariationsPanel(() => {
		cy.getByDataTest(`style-${slug}`)
			.then(filterStyleColumnElements)
			.first()
			.click({ force: true });
	});
}

/**
 * Persists a font size on a non-default size variation (`variations.{slug}`).
 * Default size rows use the shared block root path and are not covered here.
 */
export function persistSizeVariationFontSizeInStore(
	fontSize,
	slug = CUSTOMIZED_SIZE_VARIATION_SLUG
) {
	cy.window().should((win) => {
		const registry = win.wp?.data;

		if (!registry) {
			expect.fail('wp.data is not available');
		}

		const gsId = getGlobalStylesEntityId(win);
		const coreSelect = registry.select('core');
		const coreDispatch = registry.dispatch('core');
		const blockeraDispatch = registry.dispatch('blockera/editor');

		const record = coreSelect.getEditedEntityRecord(
			'root',
			'globalStyles',
			gsId
		);

		const styles = { ...(record?.styles || {}) };
		const blocks = { ...(styles.blocks || {}) };
		const buttonBlock = { ...(blocks[BLOCK_NAME] || {}) };
		const variations = { ...(buttonBlock.variations || {}) };
		const prev = variations[slug] || {};

		const payload = {
			...prev,
			blockeraFontSize: { value: fontSize },
			blockeraVariationType: VARIATION_SURFACE_SIZE,
			blockeraIsDefaultVariation:
				typeof prev.blockeraIsDefaultVariation === 'boolean'
					? prev.blockeraIsDefaultVariation
					: false,
		};

		variations[slug] = payload;
		buttonBlock.variations = variations;
		blocks[BLOCK_NAME] = buttonBlock;
		styles.blocks = blocks;

		coreDispatch.editEntityRecord('root', 'globalStyles', gsId, {
			styles,
			blockeraMetaData: record?.blockeraMetaData,
		});

		blockeraDispatch.setBlockStyles(BLOCK_NAME, slug, payload);
	});
}

export function customizeSizeVariationFontSize(
	fontSize = CUSTOMIZED_SIZE_FONT_SIZE,
	slug = CUSTOMIZED_SIZE_VARIATION_SLUG
) {
	const numericSize = String(parseFloat(fontSize));

	selectSizeVariationInGlobalStyles(slug);

	withinSizeVariationsPanel(() => {
		cy.get('[data-test="blockera-size-variation-block-card"]', {
			timeout: 20000,
		}).should('be.visible');

		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(numericSize, {
				force: true,
				delay: 0,
			});
		});
	});
}

/**
 * Persists the customized fill style variation border in global styles stores.
 */
export function persistStyleVariationBorderInStore(
	slug = STYLE_VARIATION_SLUG
) {
	cy.window().should((win) => {
		const registry = win.wp?.data;

		if (!registry) {
			expect.fail('wp.data is not available');
		}

		const gsId = getGlobalStylesEntityId(win);
		const coreSelect = registry.select('core');
		const coreDispatch = registry.dispatch('core');
		const blockeraDispatch = registry.dispatch('blockera/editor');

		const record = coreSelect.getEditedEntityRecord(
			'root',
			'globalStyles',
			gsId
		);

		const styles = { ...(record?.styles || {}) };
		const blocks = { ...(styles.blocks || {}) };
		const buttonBlock = { ...(blocks[BLOCK_NAME] || {}) };
		const variations = { ...(buttonBlock.variations || {}) };
		const prev = variations[slug] || {};

		const payload = {
			...prev,
			blockeraBorder: {
				value: CUSTOMIZED_STYLE_BORDER_VALUE,
			},
		};

		variations[slug] = payload;
		buttonBlock.variations = variations;
		blocks[BLOCK_NAME] = buttonBlock;
		styles.blocks = blocks;

		coreDispatch.editEntityRecord('root', 'globalStyles', gsId, {
			styles,
			blockeraMetaData: record?.blockeraMetaData,
		});

		blockeraDispatch.setBlockStyles(BLOCK_NAME, slug, payload);
	});
}

export function assertCustomizedSizeVariationInStore(
	expectedFontSize,
	slug = CUSTOMIZED_SIZE_VARIATION_SLUG
) {
	cy.window().should((win) => {
		const data = win.wp?.data;

		if (!data) {
			expect.fail('wp.data is not available');
		}

		const blockeraStyles = data
			.select('blockera/editor')
			.getBlockStyles(BLOCK_NAME, slug);

		expect(
			blockeraStyles?.blockeraFontSize?.value,
			'blockera/editor getBlockStyles (size variation)'
		).to.equal(expectedFontSize);
	});

	// block-base debounces core entity sync outside the inspector (~1s).
	cy.window({ timeout: 20000 }).should((win) => {
		const data = win.wp?.data;

		if (!data) {
			expect.fail('wp.data is not available');
		}

		const gsId = getGlobalStylesEntityId(win);

		expect(gsId, 'global styles entity id').to.not.equal(undefined);
		expect(gsId, 'global styles entity id').to.not.equal(null);

		const edited = data
			.select('core')
			.getEditedEntityRecord('root', 'globalStyles', gsId);

		const sizeVariation =
			edited?.styles?.blocks?.[BLOCK_NAME]?.variations?.[slug];

		expect(
			sizeVariation?.blockeraFontSize?.value,
			'global styles entity (size variation font size)'
		).to.equal(expectedFontSize);

		expect(
			sizeVariation?.blockeraVariationType,
			'size variation type persisted'
		).to.equal(VARIATION_SURFACE_SIZE);
	});
}

export function openSizeVariationPickerInInspector() {
	cy.get('[data-test="style-variations-button"].is-variation-ui-size', {
		timeout: 20000,
	})
		.should('be.visible')
		.click({ force: true });
}

export function openStyleVariationPickerInInspector() {
	cy.get('[data-test="style-variations-button"]')
		.not('.is-variation-ui-size')
		.should('be.visible')
		.click({ force: true });
}

export function pickVariationInInspectorPopover(slug) {
	cy.get('.blockera-component-popover.variations-picker-popover')
		.last()
		.should('be.visible')
		.within(() => {
			cy.getByDataTest(`style-${slug}`, { timeout: 20000 })
				.should('be.visible')
				.click({ force: true });
		});
}

export function assertButtonLinkEditorCss(expected) {
	const sizeClass =
		expected.sizeClass || `is-size-${CUSTOMIZED_SIZE_VARIATION_SLUG}`;

	cy.getBlock('core/button')
		.first()
		.should('have.class', sizeClass)
		.within(() => {
			if (expected.fontSize) {
				const targetPx = parseFloat(expected.fontSize);

				cy.get('.wp-element-button').should(($el) => {
					const px = parseFloat($el.css('font-size'));

					expect(px).to.be.closeTo(targetPx, 1);
				});
			}

			if (expected.border) {
				cy.get('.wp-element-button').should(
					'have.css',
					'border',
					expected.border
				);
			}
		});
}

export function customizeStyleVariationBorder() {
	cy.getParentContainer('Border').within(() => {
		cy.getByDataTest('border-control-width').clear();
		cy.getByDataTest('border-control-width').type('5', { force: true });
		cy.getByDataTest('border-control-color').click();
	});

	cy.getByDataTest('popover-body').within(() => {
		cy.get('[data-cy="color-picker-css-value"]').clear({ force: true });
		cy.get('[data-cy="color-picker-css-value"]').type('37e6d4', {
			delay: 0,
		});
	});

	cy.getParentContainer('Border').within(() => {
		cy.customSelectOption(1);
	});
}

export function assertButtonLinkFrontCss(expected) {
	// Front markup may omit default `is-style-fill` or use scoped `is-size-*--{id}` instance classes.
	cy.contains('.entry-content a.wp-element-button', 'button', {
		timeout: 20000,
	}).should(($link) => {
		if (expected.fontSize) {
			const targetPx = parseFloat(expected.fontSize);
			const px = parseFloat($link.css('font-size'));

			expect(px).to.be.closeTo(targetPx, 1);
		}

		if (expected.border) {
			expect($link.css('border')).to.equal(expected.border);
		}
	});
}
