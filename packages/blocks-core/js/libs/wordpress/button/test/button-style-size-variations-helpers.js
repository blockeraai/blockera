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
export const CUSTOMIZED_SIZE_BG_HEX = '#336699';
export const CUSTOMIZED_SIZE_BG_RGB = 'rgb(51, 102, 153)';

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
 * Style variations render in the main global-styles stack (not the aside).
 */
export function withinStyleVariationsPanel(callback) {
	return cy
		.get(
			'.blockera-global-styles-panel-stack > .blockera-extensions-wrapper'
		)
		.first()
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
			cy.getByDataTest(`style-${slug}`, { timeout: 20000 }).should(
				'exist'
			);
		});
	});
}

export function selectSizeVariationInGlobalStyles(slug) {
	withinSizeVariationsPanel(() => {
		cy.getByDataTest(`style-${slug}`).first().click({ force: true });
	});
}

export function selectStyleVariationInGlobalStyles(slug) {
	withinStyleVariationsPanel(() => {
		cy.getByDataTest(`style-${slug}`).first().click({ force: true });
	});
}

export function assertCustomizedSizeVariationInStore(expectedHex) {
	cy.window().should((win) => {
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
			edited?.styles?.blocks?.[BLOCK_NAME]?.variations?.[
				'e2e-size-small'
			];

		expect(
			sizeVariation?.blockeraBackgroundColor?.value,
			'global styles entity (size variation BG)'
		).to.equal(expectedHex);

		expect(
			sizeVariation?.blockeraVariationType,
			'size variation type persisted'
		).to.equal(VARIATION_SURFACE_SIZE);

		const blockeraStyles = data
			.select('blockera/editor')
			.getBlockStyles(BLOCK_NAME, 'e2e-size-small');

		expect(
			blockeraStyles?.blockeraBackgroundColor?.value,
			'blockera/editor getBlockStyles (size)'
		).to.equal(expectedHex);
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
			cy.getByDataTest(`style-${slug}`).click({ force: true });
		});
}

export function assertButtonLinkEditorCss(expected) {
	cy.getBlock('core/button')
		.first()
		.should('have.class', `is-size-e2e-size-small`)
		.within(() => {
			cy.get('.wp-element-button').should(
				'have.css',
				'background-color',
				expected.backgroundColor
			);

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
		cy.get('[aria-haspopup="listbox"]').click();
		cy.get('motion.div[aria-selected="false"], div[aria-selected="false"]')
			.eq(1)
			.click();
	});
}

export function assertButtonLinkFrontCss(expected) {
	cy.get(
		`.blockera-block.wp-block-button.is-size-e2e-size-small.is-style-${STYLE_VARIATION_SLUG}`
	)
		.first()
		.within(() => {
			cy.get('.wp-element-button').should(
				'have.css',
				'background-color',
				expected.backgroundColor
			);

			if (expected.border) {
				cy.get('.wp-element-button').should(
					'have.css',
					'border',
					expected.border
				);
			}
		});
}
