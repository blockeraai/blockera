/**
 * Blocks UI Plugin → Functionality (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getWPDataObject,
	assertBlockData,
} from '@blockera/dev-cypress/js/helpers';

const BLOCK_TYPES_SEARCH_INPUT =
	'.edit-site-block-types-search input[type="search"], .global-styles-ui-block-types-search input[type="search"]';

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
		cy.get(BLOCK_TYPES_SEARCH_INPUT).then(($search) => {
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
		});
	});

	it('should display icons for blocks with blockeraPropsId attribute', () => {
		cy.get(BLOCK_TYPES_SEARCH_INPUT).then(($search) => {
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
					const firstBlockName = blockTypesWithProps[0].name.replace(
						'/',
						'-'
					);

					cy.get(`[data-test="block-icon-${firstBlockName}"]`).should(
						'exist'
					);
				}
			});
		});
	});

	it('should render icons next to block type buttons', () => {
		cy.get(BLOCK_TYPES_SEARCH_INPUT).then(($search) => {
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

					cy.get(selector)
						.should('be.visible')
						.within(() => {
							cy.get(
								'.blockera-block-icon-wrapper svg:last-child'
							).should('exist');
						});
				});
			});
		});
	});

	it('should persist block icons after page reload', () => {
		cy.get(BLOCK_TYPES_SEARCH_INPUT).should('be.visible');
		cy.get('[data-test^="block-icon-"]').should('have.length.at.least', 1);

		cy.reload();
		openBlockStyleVariationsTab();

		cy.get(BLOCK_TYPES_SEARCH_INPUT).should('be.visible');
		cy.get('[data-test^="block-icon-"]').should('have.length.at.least', 1);
	});

	it('should work with all registered block types', () => {
		assertBlockData((data) => {
			const blockTypes = data.select('core/blocks').getBlockTypes();

			expect(blockTypes.length).to.be.greaterThan(0);
		});

		cy.get(BLOCK_TYPES_SEARCH_INPUT).then(($search) => {
			if ($search.length) {
				cy.wrap($search).should('be.visible');

				assertBlockData((data) => {
					expect(
						data.select('core/blocks').getBlockTypes().length
					).to.be.greaterThan(0);
				});
			}
		});
	});
});
