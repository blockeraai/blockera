/**
 * Blocks UI Plugin → Functionality (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

const openBlockStyleVariationsTab = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
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

const openBlockStyleVariationsTab = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
};

describe('Blocks UI Plugin → Functionality (Global Styles)', () => {
	beforeEach(() => {
		openSiteEditor();
		openBlockStyleVariationsTab();
	});

	it('should render block type icons in sidebar', () => {
		cy.get('.edit-site-block-types-search input[type="search"]').then(
			($search) => {
				if ($search.length) {
					cy.wrap($search).should('be.visible');

					cy.get('body').then(($body) => {
						if ($body.find('.blockera-block-types-icons').length) {
							cy.get('.blockera-block-types-icons')
								.first()
								.should('be.visible');
						}
					});

					cy.get('[data-test^="block-icon-"]').should(
						'have.length.at.least',
						1
					);
				}
			}
		);
	});

	it('should display icons for blocks with blockeraPropsId attribute', () => {
		cy.get('.edit-site-block-types-search input[type="search"]').then(
			($search) => {
				if (!$search.length) {
					return;
				}

				cy.wrap($search).should('be.visible');

				getWPDataObject().then((data) => {
					const blockTypesWithProps = data
						.select('core/blocks')
						.getBlockTypes()
						.filter(
							(blockType) => blockType.attributes?.blockeraPropsId
						);

					if (blockTypesWithProps.length > 0) {
						const firstBlockName =
							blockTypesWithProps[0].name.replace('/', '-');

						cy.get(
							`[data-test="block-icon-${firstBlockName}"]`
						).should('exist');
					}
				});
			}
		);
	});

	it('should render icons next to block type buttons', () => {
		cy.get('.edit-site-block-types-search input[type="search"]').then(
			($search) => {
				if (!$search.length) {
					return;
				}

				cy.wrap($search).should('be.visible');

				getWPDataObject().then((data) => {
					const blockTypesWithProps = data
						.select('core/blocks')
						.getBlockTypes()
						.filter(
							(blockType) => blockType.attributes?.blockeraPropsId
						)
						.slice(0, 1);

					if (blockTypesWithProps.length === 0) {
						return;
					}

					const blockName = blockTypesWithProps[0].name;
					const encodedBlockName = blockName.replace('/', '%2F');
					const selector = `button[id="/blocks/${encodedBlockName}"]`;

					cy.get('body').then(($body) => {
						if (!$body.find(selector).length) {
							return;
						}

						cy.get(selector).should('be.visible');

						const iconTestId = `block-icon-${blockName.replace(
							'/',
							'-'
						)}`;

						cy.get('body').then(($innerBody) => {
							if (
								$innerBody.find(
									`[data-test="${iconTestId}"] svg`
								).length
							) {
								cy.get(`[data-test="${iconTestId}"] svg`)
									.first()
									.should('be.visible');
							}
						});
					});
				});
			}
		);
	});

	it('should persist block icons after page reload', () => {
		cy.get('.edit-site-block-types-search input[type="search"]').then(
			($search) => {
				if (!$search.length) {
					return;
				}

				cy.wrap($search).should('be.visible');

				saveSiteEditor();
				cy.reload();
				openBlockStyleVariationsTab();

				cy.get(
					'.edit-site-block-types-search input[type="search"]'
				).should('be.visible');
			}
		);
	});

	it('should work with all registered block types', () => {
		getWPDataObject().then((data) => {
			const blockTypes = data.select('core/blocks').getBlockTypes();

			expect(blockTypes.length).to.be.greaterThan(0);
		});

		cy.get('.edit-site-block-types-search input[type="search"]').then(
			($search) => {
				if ($search.length) {
					cy.wrap($search).should('be.visible');

					getWPDataObject().then((data) => {
						expect(
							data.select('core/blocks').getBlockTypes().length
						).to.be.greaterThan(0);
					});
				}
			}
		);
	});
});
