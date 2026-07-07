/**
 * Cypress helpers for Blockera active-color alignment E2E tests.
 *
 * Asserts that portaled popovers inherit the same CSS custom properties as the
 * nearest StateContainer / preview active-color provider scope.
 */
import {
	appendBlocks,
	closeWelcomeGuide,
	createPost,
	openInserter,
	openSiteEditor,
	setBlockState,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';
import {
	filterStyleColumnElements,
	openButtonBlockGlobalStylesVariations,
	withinSizeVariationsPanel,
	withinStyleVariationsPanel,
} from '../../../../../blocks-core/js/libs/wordpress/button/test/button-style-size-variations-helpers';

export const INSPECTOR_MASTER_NORMAL_COLOR = '#007cba';
export const INNER_BLOCK_NORMAL_COLOR = '#cc0000';
export const HOVER_STATE_COLOR = '#d47c14';

export const GLOBAL_STYLES_STYLE_SURFACE_VAR =
	'var(--blockera-controls-block-variations-style)';
export const GLOBAL_STYLES_SIZE_SURFACE_VAR =
	'var(--blockera-controls-block-variations-size)';

/** Portaled row context menu (global styles panel — no inspector picker button). */
export const STYLE_VARIATION_SETTINGS_POPOVER =
	'.blockera-component-popover.variations-settings-popover.is-variation-ui-style';
export const SIZE_VARIATION_SETTINGS_POPOVER =
	'.blockera-component-popover.variations-settings-popover.is-variation-ui-size';

/** Last state-colors scope in the panel (composite preview / inner-block card). */
export const STATE_COLORS_CONTAINER =
	'.blockera-state-colors-container:last-child';

const ACTIVE_COLOR_CSS_VARS = [
	'--blockera-tab-panel-active-color',
	'--blockera-controls-primary-color',
];

/**
 * @param {string} containerSelector DOM selector for `.blockera-state-colors-container`.
 * @return {Cypress.Chainable<string>} `--blockera-tab-panel-active-color` value.
 */
export function getContainerActiveTabColor(containerSelector) {
	return cy
		.get(containerSelector)
		.contains('Normal')
		.then(($container) => {
			const color = window
				.getComputedStyle($container[0].closest(containerSelector))
				.getPropertyValue('--blockera-tab-panel-active-color')
				.trim();

			return color;
		});
}

/**
 * @param {string} containerSelector
 * @param {string} expected
 */
export function assertContainerActiveTabColor(containerSelector, expected) {
	getContainerActiveTabColor(containerSelector).should('eq', expected);
}

/**
 * @param {string} expected
 */
export function assertLastScopedStateContainerColor(expected) {
	cy.get('.blockera-state-colors-container')
		.last()
		.then(($container) => {
			const color = window
				.getComputedStyle($container[0])
				.getPropertyValue('--blockera-tab-panel-active-color')
				.trim();

			expect(color).to.equal(expected);
		});
}

/**
 * Last state-colors container in the style column (excludes size aside).
 *
 * @param {string} expected
 */
export function assertLastStyleColumnStateContainerColor(expected) {
	cy.get('.blockera-state-colors-container')
		.then(filterStyleColumnElements)
		.last()
		.then(($container) => {
			const color = window
				.getComputedStyle($container[0])
				.getPropertyValue('--blockera-tab-panel-active-color')
				.trim();

			expect(color).to.equal(expected);
		});
}

/**
 * Opens the per-row settings menu in the global styles style-variations list.
 *
 * Scoped to the style column (not the size aside). The row menu can sit under
 * the aside overlay edge, so we scroll + force-click instead of visibility.
 *
 * @param {string} styleSlug Preset slug (e.g. `fill`).
 */
export function openStyleVariationContextMenuInGlobalStyles(
	styleSlug = 'fill'
) {
	cy.get(`[data-test="open-${styleSlug}-contextmenu"]`)
		.should('be.visible')
		.then(filterStyleColumnElements)
		.first()
		.as('styleVariationContextMenu');

	cy.get('@styleVariationContextMenu').click({ force: true });
}

/**
 * Opens the per-row settings menu in the global styles size-variations aside.
 *
 * @param {string} styleSlug Seeded size slug (e.g. `e2e-size-small`).
 */
export function openSizeVariationContextMenuInGlobalStyles(
	styleSlug = 'e2e-size-small'
) {
	cy.get(`[data-test="open-${styleSlug}-contextmenu"]`, { timeout: 20000 })
		.first()
		.as('sizeVariationContextMenu');

	cy.get('@sizeVariationContextMenu').click({ force: true });
}

function getLastVisibleElement(selector, root = document.body) {
	const nodes = Array.from(root.querySelectorAll(selector)).filter((node) => {
		const style = window.getComputedStyle(node);

		return (
			style.display !== 'none' &&
			style.visibility !== 'hidden' &&
			node.getClientRects().length > 0
		);
	});

	return nodes.length ? nodes[nodes.length - 1] : null;
}

/**
 * Compare the last scoped state container with a visible popover (for nested `.within()`).
 *
 * @param {string} popoverSelector
 */
export function assertLastScopedStateContainerMatchesPopover(popoverSelector) {
	cy.get('.blockera-state-colors-container')
		.last()
		.then(($container) => {
			assertStateContainerMatchesPopoverElement(
				$container[0],
				popoverSelector
			);
		});
}

/**
 * Style-column variant of {@link assertLastScopedStateContainerMatchesPopover}.
 *
 * @param {string} popoverSelector
 */
export function assertLastStyleColumnStateContainerMatchesPopover(
	popoverSelector
) {
	cy.get('.blockera-state-colors-container')
		.then(filterStyleColumnElements)
		.last()
		.then(($container) => {
			assertStateContainerMatchesPopoverElement(
				$container[0],
				popoverSelector
			);
		});
}

function assertStateContainerMatchesPopoverElement(container, popoverSelector) {
	cy.document().then((doc) => {
		const popover = getLastVisibleElement(popoverSelector, doc.body);

		expect(popover, popoverSelector).to.not.equal(null);

		const containerStyle = window.getComputedStyle(container);
		const popoverStyle = window.getComputedStyle(popover);

		ACTIVE_COLOR_CSS_VARS.forEach((cssVarName) => {
			expect(
				popoverStyle.getPropertyValue(cssVarName).trim(),
				`${popoverSelector} ${cssVarName}`
			).to.equal(containerStyle.getPropertyValue(cssVarName).trim());
		});
	});
}

/**
 * Popover must expose the same active-color tokens as the reference container.
 *
 * @param {string} containerSelector
 * @param {string} popoverSelector
 */
export function assertPopoverActiveColorMatchesContainer(
	containerSelector,
	popoverSelector
) {
	cy.get(containerSelector, { timeout: 15000 }).should('exist');

	cy.get(popoverSelector, { timeout: 15000 })
		.filter(':visible')
		.last()
		.should('be.visible')
		.then(($popover) => {
			cy.document().then((doc) => {
				const container = doc.body.querySelector(containerSelector);

				expect(container, containerSelector).to.exist;

				const containerStyle = window.getComputedStyle(container);
				const popoverStyle = window.getComputedStyle($popover[0]);

				ACTIVE_COLOR_CSS_VARS.forEach((cssVarName) => {
					expect(
						popoverStyle.getPropertyValue(cssVarName).trim(),
						`${popoverSelector} ${cssVarName}`
					).to.equal(
						containerStyle.getPropertyValue(cssVarName).trim()
					);
				});
			});
		});
}

/**
 * Site Editor → Global Styles → Blocks → core/paragraph (block states UI).
 */
export function openGlobalStylesParagraphBlockPanel() {
	openSiteEditor();
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').click();
	cy.get('button[id="/blocks/core%2Fparagraph"]')
		.first()
		.click({ force: true });
	cy.get('.blockera-extension-block-card', { timeout: 20000 }).should(
		'be.visible'
	);
	cy.get('.blockera-component-block-style-variations.design-large', {
		timeout: 20000,
	}).should('exist');
}

/**
 * Site Editor → Global Styles → Blocks → core/button (style + size surfaces).
 */
export function openGlobalStylesButtonDualSurfaces() {
	openButtonBlockGlobalStylesVariations();
}

/**
 * @param {string} containerSelector
 */
export function assertStatesInserterPopoverMatchesContainer(containerSelector) {
	openInserter();
	assertPopoverActiveColorMatchesContainer(
		containerSelector,
		'.blockera-states-picker-popover'
	);
	cy.realPress('Escape');
}

/**
 * Post editor → paragraph block with link inner block (inspector scope).
 */
export function openInspectorParagraphWithLinkBlock() {
	createPost();
	cy.viewport(1440, 1025);

	cy.get('body').then(($body) => {
		if ($body.find('[aria-label="Hide secondary sidebar"]').length) {
			cy.getByAriaLabel('Hide secondary sidebar').click();
		}
	});

	appendBlocks(
		`<!-- wp:paragraph {"className":"blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74","blockeraBlockStates":{"value": {}},"blockeraPropsId":"224185412280","blockeraCompatId":"224185412280"} -->
<p class="blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74"><a href="https://example.com" class="my-link">link</a></p>
<!-- /wp:paragraph -->`
	);

	cy.getBlock('core/paragraph').click();
	cy.get('.blockera-extension-block-card', { timeout: 20000 }).should(
		'be.visible'
	);
}

export {
	openInserter,
	setBlockState,
	setInnerBlock,
	withinStyleVariationsPanel,
	withinSizeVariationsPanel,
};
