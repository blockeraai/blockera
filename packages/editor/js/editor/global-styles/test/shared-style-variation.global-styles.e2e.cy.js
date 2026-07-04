/**
 * Blockera dependencies
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

describe('Shared style variation updates across block types (Global Styles)', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').click();

		cy.get(`button[id="/blocks/core%2Fparagraph"]`).first().click();
	});

	it('applies the same Blockera background to every block type registered for the variation', () => {
		const styleSlug = `e2e-sv-${Date.now()}`;

		cy.getByDataTest('add-new-block-style-variation').first().click();

		cy.get('[role="dialog"]')
			.filter(':visible')
			.last()
			.should('contain', 'Add new style variation')
			.within(() => {
				cy.get('[aria-label="Name"]')
					.closest('[data-cy=base-control]')
					.find('input')
					.type(`{selectall}E2E Shared ${styleSlug}`, {
						delay: 0,
						force: true,
					});

				cy.get('[aria-label="ID"]')
					.closest('[data-cy=base-control]')
					.find('input')
					.type(`{selectall}${styleSlug}`, {
						delay: 0,
						force: true,
					});
			});

		cy.getByDataTest('add-style-button').should('not.be.disabled').click();

		cy.contains('[role="dialog"]', 'Add new style variation').should(
			'not.exist'
		);

		cy.window().should((win) => {
			const data = win.wp?.data;

			expect(
				data
					?.select('blockera/editor')
					?.getSelectedBlockStyleVariation()?.name,
				'selected variation after add'
			).to.equal(styleSlug);

			const blockStyles =
				data?.select('core/blocks')?.getBlockStyles('core/paragraph') ||
				[];

			expect(
				blockStyles.map((style) => style.name),
				'registered paragraph block styles'
			).to.include(styleSlug);
		});

		// Block card menu is available for the auto-selected variation even when the list row lags.
		cy.getByDataTest(`open-${styleSlug}-block-card-contextmenu`, {
			timeout: 20000,
		})
			.filter(':visible')
			.first()
			.scrollIntoView()
			.click({ force: true });

		cy.get('.variations-settings-popover')
			.filter(':visible')
			.last()
			.find('button')
			.contains('Share with other blocks')
			.click({ force: true });

		cy.getByDataTest('save-usage-for-multiple-blocks-button', {
			timeout: 20000,
		})
			.first()
			.should('be.visible');

		cy.getByDataTest('core/heading').first().scrollIntoView();
		cy.getByDataTest('core/heading').first().click({ force: true });

		cy.getByDataTest('save-usage-for-multiple-blocks-button')
			.first()
			.click();

		cy.getByDataTest('save-usage-for-multiple-blocks-button', {
			timeout: 20000,
		}).should('not.exist');

		cy.setColorControlValue('BG Color', '445566');

		const expectedHex = '#445566';

		// Retries until Blockera + global-styles entity state match (async updates).
		cy.window().should((win) => {
			const data = win.wp?.data;

			if (!data) {
				expect.fail('wp.data is not available');
			}

			const registered = data
				.select('blockera/editor')
				.getStyleVariationBlocks(styleSlug);

			expect(registered, 'styleVariationBlocks').to.include(
				'core/paragraph'
			);
			expect(registered, 'styleVariationBlocks').to.include(
				'core/heading'
			);

			const paragraphStyle = data
				.select('blockera/editor')
				.getBlockStyles('core/paragraph', styleSlug);
			const headingStyle = data
				.select('blockera/editor')
				.getBlockStyles('core/heading', styleSlug);

			expect(
				paragraphStyle?.blockeraBackgroundColor?.value,
				'blockera/editor getBlockStyles'
			).to.equal(headingStyle?.blockeraBackgroundColor?.value);
			expect(paragraphStyle?.blockeraBackgroundColor?.value).to.equal(
				expectedHex
			);

			const coreSelect = data.select('core');
			let gsId;
			if (
				typeof coreSelect.__experimentalGetCurrentGlobalStylesId ===
				'function'
			) {
				gsId = coreSelect.__experimentalGetCurrentGlobalStylesId();
			} else if (
				typeof coreSelect.getCurrentGlobalStylesId === 'function'
			) {
				gsId = coreSelect.getCurrentGlobalStylesId();
			} else {
				gsId = undefined;
			}

			expect(gsId, 'global styles entity id').to.not.equal(undefined);
			expect(gsId, 'global styles entity id').to.not.equal(null);

			const edited = coreSelect.getEditedEntityRecord(
				'root',
				'globalStyles',
				gsId
			);

			const paragraphVariation =
				edited?.styles?.blocks?.['core/paragraph']?.variations?.[
					styleSlug
				];
			const headingVariation =
				edited?.styles?.blocks?.['core/heading']?.variations?.[
					styleSlug
				];

			expect(
				paragraphVariation?.blockeraBackgroundColor?.value,
				'global styles entity (edited record)'
			).to.equal(headingVariation?.blockeraBackgroundColor?.value);
			expect(paragraphVariation?.blockeraBackgroundColor?.value).to.equal(
				expectedHex
			);
		});
	});

	// Relies on the active theme registering the shared "text-display" style for
	// core/paragraph and core/heading (e.g. Twenty Twenty-Five styles/blocks/01-display.json).
	it('duplicates a shared style via handleOnDuplicate and registers the copy for every block type that used the original', () => {
		const styleSlug = 'text-display';
		const expectedHex = '#aabbcc';

		cy.getByDataTest(`style-${styleSlug}`, { timeout: 20000 })
			.first()
			.click({ force: true });

		cy.setColorControlValue('BG Color', 'aabbcc');

		cy.window().should((win) => {
			const data = win.wp?.data;
			if (!data) {
				expect.fail('wp.data is not available');
			}
			const coreSelect = data.select('core');
			let gsId;
			if (
				typeof coreSelect.__experimentalGetCurrentGlobalStylesId ===
				'function'
			) {
				gsId = coreSelect.__experimentalGetCurrentGlobalStylesId();
			} else if (
				typeof coreSelect.getCurrentGlobalStylesId === 'function'
			) {
				gsId = coreSelect.getCurrentGlobalStylesId();
			} else {
				gsId = undefined;
			}
			const edited = coreSelect.getEditedEntityRecord(
				'root',
				'globalStyles',
				gsId
			);
			expect(
				edited?.styles?.blocks?.['core/paragraph']?.variations?.[
					styleSlug
				]?.blockeraBackgroundColor?.value,
				'source variation BG before duplicate'
			).to.equal(expectedHex);
		});

		cy.getByDataTest(`open-${styleSlug}-block-card-contextmenu`)
			.filter(':visible')
			.first()
			.as('blockCardStyleContextMenu');
		cy.get('@blockCardStyleContextMenu').scrollIntoView();
		cy.get('@blockCardStyleContextMenu').click({ force: true });

		cy.get('.variations-settings-popover')
			.filter(':visible')
			.last()
			.find('button')
			.contains('Duplicate')
			.click({ force: true });

		cy.getByDataTest('save-duplicate-button', { timeout: 20000 })
			.should('be.visible')
			.and('be.enabled')
			.click();

		// Resolve the new slug from editor + entity state (list row may be covered by inspector UI).
		cy.window().should((win) => {
			const data = win.wp?.data;

			if (!data) {
				expect.fail('wp.data is not available');
			}

			const blockeraSelect = data.select('blockera/editor');
			const coreSelect = data.select('core');

			let gsId;
			if (
				typeof coreSelect.__experimentalGetCurrentGlobalStylesId ===
				'function'
			) {
				gsId = coreSelect.__experimentalGetCurrentGlobalStylesId();
			} else if (
				typeof coreSelect.getCurrentGlobalStylesId === 'function'
			) {
				gsId = coreSelect.getCurrentGlobalStylesId();
			} else {
				gsId = undefined;
			}

			expect(gsId, 'global styles entity id').to.not.equal(undefined);
			expect(gsId, 'global styles entity id').to.not.equal(null);

			const edited = coreSelect.getEditedEntityRecord(
				'root',
				'globalStyles',
				gsId
			);
			const paragraphVariations =
				edited?.styles?.blocks?.['core/paragraph']?.variations ?? {};

			const origRegistered =
				blockeraSelect.getStyleVariationBlocks(styleSlug);
			expect(origRegistered, 'original style blocks').to.include(
				'core/paragraph'
			);
			expect(origRegistered, 'original style blocks').to.include(
				'core/heading'
			);

			// DuplicateModal IDs always contain "copy" (see getDefaultDuplicateId); avoid
			// confusing other variations from earlier tests (e.g. e2e-sv-*) that share blocks.
			// Prefer the newest `*-copy*` slug when stale rows exist in the entity.
			const copyKeys = Object.keys(paragraphVariations)
				.filter(
					(k) =>
						k !== styleSlug &&
						k.includes('copy') &&
						paragraphVariations[k] !== undefined &&
						paragraphVariations[k] !== null
				)
				.sort();
			const duplicateSlug = copyKeys[copyKeys.length - 1];

			expect(duplicateSlug, 'duplicated variation slug').to.be.a(
				'string'
			);

			const copyRegistered =
				blockeraSelect.getStyleVariationBlocks(duplicateSlug);

			expect(
				copyRegistered,
				'duplicated style variation blocks'
			).to.include('core/paragraph');
			expect(
				copyRegistered,
				'duplicated style variation blocks'
			).to.include('core/heading');

			const paragraphCopyVariation = paragraphVariations[duplicateSlug];
			const headingCopyVariation =
				edited?.styles?.blocks?.['core/heading']?.variations?.[
					duplicateSlug
				];

			expect(
				paragraphCopyVariation?.blockeraBackgroundColor?.value,
				'global styles entity: duplicated variations match'
			).to.equal(headingCopyVariation?.blockeraBackgroundColor?.value);
			expect(
				paragraphCopyVariation?.blockeraBackgroundColor?.value
			).to.equal(expectedHex);
		});
	});
});
