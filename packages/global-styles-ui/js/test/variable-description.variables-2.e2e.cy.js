/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesColorPaletteScreen,
	openGlobalStylesFontSizesVariablesScreen,
	savePage,
	setGlobalStylesPresetDescription,
} from '@blockera/dev-cypress/js/helpers';

const UPDATED_DESCRIPTION = 'Updated E2E description after edit.';

function assertDescriptionInVisiblePopover(expected) {
	cy.get('.components-popover')
		.filter(':visible')
		.last()
		.within(() => {
			cy.getByDataTest('global-styles-preset-description-field').should(
				'have.value',
				expected
			);
		});
}

describe('Global Styles UI → variable description (theme.json meta.description)', () => {
	describe('color presets', () => {
		const MU =
			'packages/global-styles-ui/js/test/fixtures/e2e-preset-description-color.php';
		const MU_NAME = 'blockera-test-e2e-preset-description-color.php';
		const INITIAL_DESCRIPTION =
			'Initial E2E color description from theme fixture.';

		beforeEach(() => {
			activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, MU_NAME);
		});

		it('loads fixture description, persists edit after save and reload', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-color-palette-presets', {
				timeout: 20000,
			}).should('contain', 'E2E Desc Ruby');

			cy.contains(
				'.blockera-color-palette-presets [data-cy="color-repeater-item-header"]',
				'E2E Desc Ruby'
			).click({ force: true });

			assertDescriptionInVisiblePopover(INITIAL_DESCRIPTION);

			setGlobalStylesPresetDescription(UPDATED_DESCRIPTION);

			cy.realPress('Escape');

			getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-desc-ruby');
				expect(row.meta.description).to.eq(UPDATED_DESCRIPTION);
			});

			savePage();

			cy.reload();

			openGlobalStylesColorPaletteScreen({ reset: false });

			cy.contains(
				'.blockera-color-palette-presets [data-cy="color-repeater-item-header"]',
				'E2E Desc Ruby'
			).click({ force: true });

			assertDescriptionInVisiblePopover(UPDATED_DESCRIPTION);

			getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-desc-ruby');
				expect(row.meta.description).to.eq(UPDATED_DESCRIPTION);
			});
		});

		it('preserves other meta keys when description is edited', () => {
			openGlobalStylesColorPaletteScreen();

			cy.contains(
				'.blockera-color-palette-presets [data-cy="color-repeater-item-header"]',
				'E2E Desc Small Slot'
			).click({ force: true });

			setGlobalStylesPresetDescription(UPDATED_DESCRIPTION);

			cy.realPress('Escape');

			getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
				const row = rows.find(
					(r) => r.slug === 'e-2-e-desc-small-slot'
				);
				expect(row.meta.description).to.eq(UPDATED_DESCRIPTION);
				expect(row.meta['interface-size']).to.eq('small');
			});
		});
	});

	describe('font size presets', () => {
		const MU =
			'packages/global-styles-ui/js/test/fixtures/e2e-preset-description-font-size.php';
		const MU_NAME = 'blockera-test-e2e-preset-description-font-size.php';
		const INITIAL_DESCRIPTION =
			'Initial E2E font size description from theme fixture.';

		beforeEach(() => {
			activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, MU_NAME);
		});

		it('loads fixture description, persists edit after save and reload', () => {
			openGlobalStylesFontSizesVariablesScreen();

			cy.get('.blockera-font-size-editor', { timeout: 20000 }).should(
				'contain',
				'E2E Desc Font Size'
			);

			cy.contains(
				'.blockera-font-size-editor [data-cy="font-size-repeater-item-header"]',
				'E2E Desc Font Size'
			).click({ force: true });

			assertDescriptionInVisiblePopover(INITIAL_DESCRIPTION);

			setGlobalStylesPresetDescription(UPDATED_DESCRIPTION);

			cy.realPress('Escape');

			getEditedGlobalStylesSetting('typography.fontSizes.theme').then(
				(rows) => {
					const row = rows.find((r) => r.slug === 'e-2-e-desc-fs');
					expect(row.meta.description).to.eq(UPDATED_DESCRIPTION);
				}
			);

			savePage();

			cy.reload();

			openGlobalStylesFontSizesVariablesScreen({ reset: false });

			cy.contains(
				'.blockera-font-size-editor [data-cy="font-size-repeater-item-header"]',
				'E2E Desc Font Size'
			).click({ force: true });

			assertDescriptionInVisiblePopover(UPDATED_DESCRIPTION);

			getEditedGlobalStylesSetting('typography.fontSizes.theme').then(
				(rows) => {
					const row = rows.find((r) => r.slug === 'e-2-e-desc-fs');
					expect(row.meta.description).to.eq(UPDATED_DESCRIPTION);
				}
			);
		});
	});
});
