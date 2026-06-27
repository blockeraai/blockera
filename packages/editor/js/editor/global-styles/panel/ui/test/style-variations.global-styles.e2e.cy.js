/**
 * Style Variations Inside Global Styles Panel → Functionality
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

const openGroupBlockStyleVariations = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fgroup"]').click();
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
		cy.getByDataTest('style-section-1').click();
		cy.getByDataTest('style-section-1').should('contain', 'New Name');
	});

	it('should be able to rename with new ID specific style variation', () => {
		cy.getByDataTest('style-section-1').click();
		cy.getByDataTest('open-section-1-block-card-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();

		cy.getParentContainer('Name').within(() => {
			cy.get('input').clear();
			cy.get('input').type('New Name');
		});

		cy.getParentContainer('ID').within(() => {
			cy.get('input').clear();
			cy.get('input').type('new id');
		});

		cy.get('input[type="checkbox"]').check();
		cy.getByDataTest('save-rename-button').click();
		cy.get('.blockera-extension-block-card__close').click();
		cy.getByDataTest('style-new-id').should('contain', 'New Name');

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-new-id').should('contain', 'New Name');
	});

	it('should be able to Active/Inactive specific style variation', () => {
		cy.getByDataTest('open-new-id-contextmenu').first().click();

		cy.get('.blockera-component-grid')
			.contains('Active Style')
			.parents('.blockera-component-grid')
			.find('input')
			.click();

		cy.getByDataTest('style-new-id').should('not.have.class', 'is-enabled');

		cy.getByDataTest('style-new-id').click();

		getWPDataObject().then((data) => {
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

		getWPDataObject().then((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});

		saveSiteEditor();
		cy.reload();
		openGroupBlockStyleVariations();
		cy.getByDataTest('style-new-id').click();

		getWPDataObject().then((data) => {
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

		getWPDataObject().then((data) => {
			expect(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			).to.equal(undefined);
		});
	});

	it('should be able to delete specific style variation', () => {
		cy.getByDataTest('open-new-id-contextmenu').first().click();
		cy.get('.blockera-component-popover-body button')
			.contains('Delete')
			.click();

		cy.get('.components-modal__content')
			.find('input[type="checkbox"]')
			.check();
		cy.getByDataTest('delete-button').click();

		cy.getByDataTest('style-new-id').should('not.exist');

		getWPDataObject().then((data) => {
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

		getWPDataObject().then((data) => {
			expect(
				data.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			).to.equal(3);
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
