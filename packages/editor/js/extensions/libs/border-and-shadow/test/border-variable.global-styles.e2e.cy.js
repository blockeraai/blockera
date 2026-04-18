/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesBordersScreen,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
	setGlobalStylesCustomBorderPresetMinWidth,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles border preset → value addon (Border)', () => {
	const presetName = 'E2E Border';
	const slug = 'e-2-e-border';
	const addDataTest = 'global-styles-preset-add-border-preset-presets-custom';

	function seedBorderPreset() {
		openGlobalStylesBordersScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		setGlobalStylesCustomBorderPresetMinWidth('2');
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom border preset via the border variable picker', () => {
		seedBorderPreset();

		createPost();

		cy.getBlock('default').type('Border preset paragraph.', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Border').within(() => {
			cy.openValueAddon(1);
		});

		cy.selectValueAddonItem(slug);

		const varNeedle = `--wp--preset--border--${slug}`;

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', varNeedle);
		});

		expectBlockAttrIncludesPresetVar('blockeraBorder', varNeedle);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', varNeedle);
	});

	it('updates generated CSS when the border width is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Border preset edit paragraph.', {
			delay: 0,
		});
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Border').within(() => {
			cy.openValueAddon(1);
		});
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesBordersScreen({ reset: false });

		cy.getByDataCy('border-preset-repeater-item-header')
			.last()
			.click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('border-control-width').clear({ force: true });
				cy.getByDataTest('border-control-width').type('5', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', `--wp--preset--border--${slug}`);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', `--wp--preset--border--${slug}`);

		cy.get('.blockera-block').should('have.css', 'border-top-width', '5px');
	});
});
