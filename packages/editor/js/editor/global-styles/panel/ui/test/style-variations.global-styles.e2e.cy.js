/**
 * Style Variations Inside Global Styles Panel → Functionality
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	assertBlockData,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Restores the theme's group style-variation baseline (default, section-1 …
 * section-5) and drops any leftover user variations (duplicates, renames).
 *
 * Rename/delete/duplicate write markers to `blockeraGlobalStylesMetaData`, which
 * is persisted to a server meta cache (see
 * packages/wordpress/php/RenderBlock/SavePost.php) and replayed on every load by
 * `registerBlockStylesFromMetaData` (block-styles-registry.js) — it unregisters
 * theme variations flagged `hasNewID`/`isDeleted`. So a prior run's delete leaves
 * `style-section-1` permanently unregistered and the whole suite can no longer run.
 *
 * Clearing meta alone is not enough: rename-with-new-id also writes the new slug
 * into `styles.blocks.*.variations`. On the next load,
 * `JSONResolver::register_block_style_variations_from_user_data` re-registers that
 * leftover variation. With empty meta it invents a label from the slug
 * (`new-id` → "New Id"), so `style-new-id` still appears but fails
 * `should('contain', 'New Name')` in Active/Inactive + delete specs.
 *
 * Persist an EMPTY *but present* `styles.blockeraMetaData` (SavePost only rewrites
 * the cache when that key exists) and drop `styles.blocks` so PHP cannot
 * re-register orphan slugs, then reload so bootstrap re-registers the pristine
 * theme variations.
 */
const resetGroupStyleVariationsBaseline = () => {
	// Wait until the global styles entity resolves after the Site Editor loads.
	cy.window({ timeout: 20000 }).should((win) => {
		const select = win.wp?.data?.select?.('core');
		const id =
			select?.__experimentalGetCurrentGlobalStylesId?.() ??
			select?.getCurrentGlobalStylesId?.();
		expect(id, 'global styles entity id').to.exist;
	});

	cy.window().then((win) => {
		const registry = win.wp.data;

		// Clear Blockera's in-memory rename/delete/duplicate markers first so a
		// later compatibility-enabled save cannot merge them back.
		const blockeraDispatch = registry.dispatch('blockera/editor');
		if (
			typeof blockeraDispatch?.setBlockeraGlobalStylesMetaData ===
			'function'
		) {
			blockeraDispatch.setBlockeraGlobalStylesMetaData({});
		}
		if (typeof blockeraDispatch?.setGlobalStyles === 'function') {
			blockeraDispatch.setGlobalStyles({});
		}
		win.blockeraGlobalStylesMetaData = {};

		const select = registry.select('core');
		const dispatch = registry.dispatch('core');
		const id =
			select.__experimentalGetCurrentGlobalStylesId?.() ??
			select.getCurrentGlobalStylesId?.();

		if (!id) {
			return;
		}

		// Keep `blockeraMetaData` present (empty) so SavePost refreshes the meta
		// cache; omit `blocks` so renamed slugs are not re-registered from user data.
		dispatch.editEntityRecord('root', 'globalStyles', id, {
			styles: { blockeraMetaData: {} },
		});
	});

	// Skip compatibility: it re-hydrates theme `styles.blocks` from base config.
	saveSiteEditorDirtyEntities({ runCompatibility: false });

	// Re-navigate (fresh load) so bootstrap re-reads the now-empty meta cache and
	// re-registers the pristine theme variations. `openSiteEditor` also waits for
	// the editor to settle + closes the welcome guide.
	openSiteEditor();
};

const openGroupBlockStyleVariations = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations', { timeout: 20000 })
		.eq(0)
		.click();
	cy.get('button[id="/blocks/core%2Fgroup"]', { timeout: 20000 }).click();

	// Wait for the group's style-variation cards to hydrate before a test queries
	// a specific slug (style-section-1 / style-new-id). The cards render async from
	// the global styles entity/registry, so after a save + reload a slow Site Editor
	// load can exceed the 15s command timeout even though the card renders later.
	// `style-default` is always present, so it is a reliable "list is ready" signal.
	// Assert existence (not visibility): cards can sit in a fixed/overflowed panel.
	cy.getByDataTest('style-default', { timeout: 20000 }).should('exist');
};

const saveSiteEditor = () => {
	cy.get(
		'.edit-site-save-hub__button, .edit-site-save-button__button, .editor-post-publish-button',
		{ timeout: 20000 }
	)
		.filter(':visible')
		.first()
		.then(($btn) => {
			if (!$btn.is(':disabled')) {
				cy.wrap($btn).click({ force: true });
			}
		});

	cy.get('body').then(($body) => {
		if ($body.find('.editor-entities-saved-states__save-button').length) {
			cy.get('.editor-entities-saved-states__save-button')
				.filter(':visible')
				.first()
				.click({ force: true });
		}
	});

	cy.get('.components-snackbar, .components-notice.is-success').should(
		'be.visible'
	);
};

const openSiteEditorDocumentPanel = () => {
	cy.get('.interface-interface-skeleton button[aria-controls*=":document"]')
		.first()
		.then(($btn) => {
			if ($btn.attr('aria-pressed') !== 'true') {
				cy.wrap($btn).click({ force: true });
			}
		});
};

const renameSection1WithNewId = (label = 'New Name', id = 'new-id') => {
	cy.getByDataTest('style-section-1').click();
	cy.getByDataTest('open-section-1-block-card-contextmenu').click();
	cy.get('.blockera-component-popover-body button')
		.contains('Rename')
		.click();

	cy.getParentContainer('Name').within(() => {
		cy.get('input').clear();
		cy.get('input').type(label);
	});

	cy.getParentContainer('ID').within(() => {
		cy.get('input').clear();
		cy.get('input').type(id);
	});

	cy.get('input[type="checkbox"]').check();
	cy.getByDataTest('save-rename-button').click();
	cy.get('.blockera-extension-block-card__close').click();
	cy.getByDataTest(`style-${id}`).should('contain', label);
};

const ensureNewIdStyleVariation = (label = 'New Name', id = 'new-id') => {
	// Presence check must be non-throwing so the rename fallback stays reachable
	// when a prior test/run left no `new-id` card. `cy.get(selector)` retries and
	// then FAILS on absence (skipping the else branch) — the earlier reason for
	// switching away from `$body.find` was an un-hydrated list, which is now
	// guaranteed to be ready by `openGroupBlockStyleVariations` (waits for
	// `style-default`), so `$body.find` reflects the real state.
	//
	// Also require the expected label: a leftover `styles.blocks` slug can be
	// re-registered with a generated label ("New Id") after meta-only resets.
	cy.get('body').then(($body) => {
		const $card = $body.find(`[data-test="style-${id}"]`);
		const hasExpectedLabel =
			$card.length > 0 && $card.text().includes(label);

		if (hasExpectedLabel) {
			cy.getByDataTest(`style-${id}`).should('contain', label);
		} else {
			renameSection1WithNewId(label, id);
		}
	});
};

const openStyleVariationContextMenu = (styleSlug) => {
	cy.getByDataTest(`open-${styleSlug}-contextmenu`)
		.filter(':visible')
		.first()
		.as('styleContextMenuTrigger');

	cy.get('@styleContextMenuTrigger').scrollIntoView();
	cy.get('@styleContextMenuTrigger').click({ force: true });

	cy.get('.variations-settings-popover')
		.filter(':visible')
		.last()
		.should('be.visible');
};

const setStyleVariationActive = (styleSlug, active) => {
	const currentLabel = active ? 'Inactive Style' : 'Active Style';

	cy.get('.variations-settings-popover')
		.filter(':visible')
		.last()
		.find(`[data-test="${styleSlug}-active-toggle-row"]`)
		.should('contain', currentLabel);

	cy.get('.variations-settings-popover')
		.filter(':visible')
		.last()
		.find(`[data-test="${styleSlug}-active-toggle-row"]`)
		.find('.components-form-toggle__input')
		.click({ force: true });
};

const selectBlockByType = (blockName, index = 0) => {
	cy.window().then((win) => {
		const blockEditor = win.wp.data.select('core/block-editor');
		const dispatch = win.wp.data.dispatch('core/block-editor');

		const clientIds = [];

		const collectByType = (
			blockList,
			targetName,
			insideTemplatePart,
			out
		) => {
			for (const block of blockList) {
				let inTemplatePart = insideTemplatePart;

				if (block.name === 'core/template-part') {
					inTemplatePart = true;
				}

				if (block.name === targetName && !inTemplatePart) {
					out.push(block.clientId);
				}

				if (block.innerBlocks?.length) {
					collectByType(
						block.innerBlocks,
						targetName,
						inTemplatePart,
						out
					);
				}
			}
		};

		collectByType(blockEditor.getBlocks(), blockName, false, clientIds);
		dispatch.selectBlock(clientIds[index]);
	});
};

describe('Style Variations Inside Global Styles Panel → Functionality (Global Styles)', () => {
	beforeEach(() => {
		openSiteEditor();

		// Specs rename/delete/duplicate theme variations and persist them to the
		// global styles entity + server meta cache. Without a reset, a prior run's
		// delete leaves `style-section-1` unregistered forever and the suite can
		// never re-run. Restore the pristine theme baseline before every test.
		resetGroupStyleVariationsBaseline();

		openGroupBlockStyleVariations();
	});

	it('should be able to duplicate specific style variation', () => {
		cy.getByDataTest('open-default-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.get('.blockera-component-style-variation-modal')
			.find('[data-test="save-duplicate-button"]')
			.click();

		cy.getByDataTest('Close Block Style').click();
		cy.getByDataTest('style-default-copy').should('be.visible');

		cy.getByDataTest('open-default-copy-contextmenu').first().click();
		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('promote-global-styles-premium-feature').should(
			'be.exist'
		);

		cy.getByAriaLabel('Close').click();

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-default-copy').should('be.exist');
	});

	it('should be able to rename specific style variation', () => {
		cy.getByDataTest('style-section-1').click();
		cy.getByDataTest('open-section-1-block-card-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();

		cy.getParentContainer('Name').within(() => {
			cy.get('input').clear();
			cy.get('input').type('New Name');
			cy.get('input').should('have.value', 'New Name');
		});

		cy.getByDataTest('save-rename-button').click();
		cy.get('.blockera-extension-block-card__close').click();
		cy.getByDataTest('style-section-1').should('contain', 'New Name');

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-section-1').should('contain', 'New Name');
	});

	it('should be able to rename with new ID specific style variation', () => {
		renameSection1WithNewId();

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-new-id').should('contain', 'New Name');
	});

	it('should be able to Active/Inactive specific style variation', () => {
		ensureNewIdStyleVariation();

		openStyleVariationContextMenu('new-id');
		setStyleVariationActive('new-id', false);

		cy.getByDataTest('style-new-id').should('not.have.class', 'is-enabled');

		cy.getByDataTest('style-new-id').click();

		assertBlockData((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});

		openSiteEditorDocumentPanel();
		selectBlockByType('core/group', 0);

		cy.getByDataTest('style-variations-button').should('be.visible');
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.find('[data-test="style-new-id"]')
			.should('not.exist');

		assertBlockData((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-new-id').click();

		assertBlockData((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});

		openSiteEditorDocumentPanel();
		selectBlockByType('core/group', 0);

		cy.getByDataTest('style-variations-button').should('be.visible');
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.find('[data-test="style-new-id"]')
			.should('not.exist');

		assertBlockData((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});
	});

	it('should be able to delete specific style variation', () => {
		ensureNewIdStyleVariation();

		openStyleVariationContextMenu('new-id');
		cy.get('.variations-settings-popover')
			.filter(':visible')
			.last()
			.find('button')
			.contains('Delete')
			.click({ force: true });

		cy.get('.components-modal__content')
			.find('input[type="checkbox"]')
			.check();
		cy.getByDataTest('delete-button').click();

		cy.getByDataTest('style-new-id').should('not.exist');

		assertBlockData((data) => {
			expect(
				data.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			).to.equal(5);
		});

		openSiteEditorDocumentPanel();
		selectBlockByType('core/group', 0);

		cy.getByDataTest('style-variations-button').should('be.visible');
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.find('[data-test="style-new-id"]')
			.should('not.exist');

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-new-id').should('not.exist');

		assertBlockData((data) => {
			expect(
				data.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			).to.equal(5);
		});

		openSiteEditorDocumentPanel();
		selectBlockByType('core/group', 0);

		cy.getByDataTest('style-variations-button').should('be.visible');
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.find('[data-test="style-new-id"]')
			.should('not.exist');
	});
});
