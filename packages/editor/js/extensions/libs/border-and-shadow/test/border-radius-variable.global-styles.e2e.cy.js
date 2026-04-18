/**
 * Blockera dependencies
 */
import {
	createPost,
	expectBlockAttrIncludesPresetVar,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesBorderRadiusScreen,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles border-radius preset → value addon (Radius)', () => {
	const presetName = 'E2E Radius';
	const slug = 'e-2-e-radius';
	const addDataTest = 'global-styles-preset-add-border-radius-presets-custom';
	const defaultFallback = '4px';

	function seedRadiusPreset() {
		openGlobalStylesBorderRadiusScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('applies the custom border-radius preset', () => {
		seedRadiusPreset();

		const expectedDecl = `border-radius: var(--wp--preset--border-radius--${slug}, ${defaultFallback})`;

		createPost();

		cy.getBlock('default').type('Radius preset paragraph.', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Radius').within(() => {
			cy.openValueAddon();
		});

		cy.selectValueAddonItem(slug);

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedDecl);
		});

		expectBlockAttrIncludesPresetVar(
			'blockeraBorderRadius',
			`--wp--preset--border-radius--${slug}`
		);

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedDecl);
	});

	it('updates generated CSS when the radius size is edited in global styles after picking it', () => {
		createPost();

		cy.getBlock('default').type('Radius preset edit paragraph.', {
			delay: 0,
		});
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Radius').within(() => {
			cy.openValueAddon();
		});
		cy.selectValueAddonItem(slug);

		savePage();

		openGlobalStylesBorderRadiusScreen({ reset: false });

		cy.getByDataCy('border-radius-preset-repeater-item-header')
			.last()
			.click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByAriaLabel('Radius').clear({ force: true });
				cy.getByAriaLabel('Radius').type('12px', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					`border-radius: var(--wp--preset--border-radius--${slug}, 12px)`
				);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				`border-radius: var(--wp--preset--border-radius--${slug}, 12px)`
			);

		cy.get('.blockera-block').should('have.css', 'border-radius', '12px');
	});
});
