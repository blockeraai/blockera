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
				// One subject per command: clear() calls click() internally; avoid cy.wrap(jQuery).
				cy.get('input:visible').should('have.length.at.least', 2);
				cy.get('input:visible').eq(0).clear({ force: true });
				cy.get('input:visible')
					.eq(0)
					.type(`E2E Shared ${styleSlug}`, { delay: 0, force: true });
				cy.get('input:visible').eq(1).clear({ force: true });
				cy.get('input:visible').eq(1).type(styleSlug, {
					delay: 0,
					force: true,
				});
			});

		cy.getByDataTest('add-style-button').click();

		cy.getByDataTest(`style-${styleSlug}`, { timeout: 20000 })
			.first()
			.click({ force: true });

		cy.getByDataTest(`${styleSlug}-usage-for-blocks-trigger`)
			.first()
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

		cy.getByDataTest(`style-${styleSlug}`).first().click({ force: true });

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
});
