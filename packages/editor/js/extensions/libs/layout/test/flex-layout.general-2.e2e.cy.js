import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

const FLEX_GROUP = `<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

const FLEX_COLUMNS = `<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`;

const BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR = [
	'core/group',
	'core/columns',
	'core/column',
	'core/buttons',
];

const CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS = [
	'Justify',
	'Align top',
	'Align middle',
	'Align bottom',
	'Change vertical alignment',
	'Stretch to fill',
];

const BLOCKERA_LAYOUT_TOOLBAR_SCOPE =
	'[data-test="data-blockera-layout-toolbar"]';

function assertSelectedBlockType(blockName) {
	cy.getSelectedBlock().should('have.attr', 'data-type', blockName);
}

function assertCoreLayoutToolbarHidden(blockName) {
	cy.window().then((win) => {
		const layoutSupport = win.wp.blocks.getBlockSupport(
			blockName,
			'layout'
		);

		expect(layoutSupport.allowJustification).to.equal(false);
		expect(layoutSupport.allowVerticalAlignment).to.equal(false);
	});

	// Columns/column controls are hidden via DOM (display:none), not unmounted.
	cy.get('.block-editor-block-toolbar')
		.should('be.visible')
		.then(($toolbar) => {
			CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS.forEach((pattern) => {
				const $visibleControls = $toolbar
					.find(`[aria-label*="${pattern}"]`)
					.filter(':visible')
					.filter(
						(index, element) =>
							Cypress.$(element).closest(
								BLOCKERA_LAYOUT_TOOLBAR_SCOPE
							).length === 0
					);

				expect(
					$visibleControls.length,
					`core layout toolbar control "${pattern}" should be hidden`
				).to.equal(0);
			});
		});
}

function assertBlockeraLayoutToolbarVisible() {
	cy.get('.block-editor-block-toolbar')
		.should('be.visible')
		.within(() => {
			cy.get(`${BLOCKERA_LAYOUT_TOOLBAR_SCOPE} .components-toolbar-group`)
				.filter(':visible')
				.should('have.length.at.least', 2);
		});
}

function assertBlockToolbarInterface(blockName) {
	assertSelectedBlockType(blockName);
	assertCoreLayoutToolbarHidden(blockName);
	assertBlockeraLayoutToolbarVisible();

	cy.get('.block-editor-block-toolbar').should('be.visible');

	cy.get('.block-editor-block-toolbar').within(() => {
		cy.get('[class*="block-editor-block-switcher"]').should('exist');
		cy.get('.block-editor-block-toolbar__slot').should('exist');
		cy.get('.block-editor-block-toolbar__slot button').should(
			'have.length.at.least',
			1
		);
	});

	cy.get('.block-editor-block-toolbar').then(($toolbar) => {
		const $visibleMatrix = $toolbar
			.find('[data-test^="matrix-"]')
			.filter(':visible');

		expect($visibleMatrix.length).to.equal(0);
	});

	cy.get('.blockera-extension-block-card').should('be.visible');
	cy.getParentContainer('Flex Layout').should('be.visible');
}

function assertCoreLayoutToolbarSupportsRegistered() {
	cy.window().then((win) => {
		BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR.forEach((blockName) => {
			const layoutSupport = win.wp.blocks.getBlockSupport(
				blockName,
				'layout'
			);

			expect(layoutSupport.allowJustification).to.equal(false);
			expect(layoutSupport.allowVerticalAlignment).to.equal(false);
		});
	});
}

function openFlexDisplayInBlockera() {
	cy.addNewTransition();
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Display').within(() => {
		cy.getByAriaLabel('Flex').then(($flexButton) => {
			if ($flexButton.attr('aria-pressed') !== 'true') {
				cy.wrap($flexButton).click();
			}
		});
	});
}

function selectParentBlockFromChild() {
	cy.get('[aria-label^="Select parent block:"]').click();
}

function openFlexGroupInBlockera() {
	appendBlocks(FLEX_GROUP);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

function openFlexColumnsInBlockera() {
	appendBlocks(FLEX_COLUMNS);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

function openFlexColumnInBlockera() {
	appendBlocks(FLEX_COLUMNS);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

/**
 * Matrix slots use screen vertical/horizontal; column stores them on swapped flex props.
 */
function getMatrixFlexExpectations(type, alignItemsRow, justifyContentRow) {
	if (type === 'flex-direction: row') {
		return {
			alignItems: alignItemsRow,
			justifyContent: justifyContentRow,
		};
	}

	return {
		alignItems: justifyContentRow,
		justifyContent: alignItemsRow,
	};
}

/** Space-around / space-between live on justify-content (row: horizontal = index 0, column: vertical = index 1). */
function getJustifyAxisSelectIndex(type) {
	return type === 'flex-direction: row' ? 0 : 1;
}

/** Stretch lives on align-items (row: vertical = index 1, column: horizontal = index 0). */
function getAlignAxisSelectIndex(type) {
	return type === 'flex-direction: row' ? 1 : 0;
}

const MATRIX_ALIGNMENT_POINTS = [
	{
		testId: 'matrix-top-left-normal',
		rowAlign: 'flex-start',
		rowJustify: 'flex-start',
	},
	{
		testId: 'matrix-top-center-normal',
		rowAlign: 'flex-start',
		rowJustify: 'center',
	},
	{
		testId: 'matrix-top-right-normal',
		rowAlign: 'flex-start',
		rowJustify: 'flex-end',
	},
	{
		testId: 'matrix-center-left-normal',
		rowAlign: 'center',
		rowJustify: 'flex-start',
	},
	{
		testId: 'matrix-center-center-normal',
		rowAlign: 'center',
		rowJustify: 'center',
	},
	{
		testId: 'matrix-center-right-normal',
		rowAlign: 'center',
		rowJustify: 'flex-end',
	},
	{
		testId: 'matrix-bottom-left-normal',
		rowAlign: 'flex-end',
		rowJustify: 'flex-start',
	},
	{
		testId: 'matrix-bottom-center-normal',
		rowAlign: 'flex-end',
		rowJustify: 'center',
	},
	{
		testId: 'matrix-bottom-right-normal',
		rowAlign: 'flex-end',
		rowJustify: 'flex-end',
	},
];

function ensureParagraphBlockCount(total) {
	cy.getBlock('core/paragraph').then(($blocks) => {
		const needed = total - $blocks.length;

		Cypress._.times(needed, (index) => {
			cy.getBlock('core/paragraph')
				.last()
				.click()
				.type('{moveToEnd}{enter}', { delay: 0 });

			cy.getBlock('core/paragraph')
				.last()
				.type(`Paragraph ${$blocks.length + index + 1}`, {
					delay: 0,
				});
		});
	});
}

function ensureBlockDisplayFlex(blockIndex) {
	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.then(($block) => {
			if ($block.css('display') !== 'flex') {
				cy.getParentContainer('Display').within(() => {
					cy.getByAriaLabel('Flex').click();
				});
			}
		});
}

function configureBlockMatrixAlignment(blockIndex, type, point) {
	const { alignItems, justifyContent } = getMatrixFlexExpectations(
		type,
		point.rowAlign,
		point.rowJustify
	);

	cy.getBlock('core/paragraph').eq(blockIndex).click();
	cy.getByAriaControls('styles-view').click();

	ensureBlockDisplayFlex(blockIndex);

	cy.getParentContainer('Flex Layout').within(() => {
		cy.getByAriaLabel(type).click();
	});

	cy.getByDataTest(point.testId).click();

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'align-items', alignItems);

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'justify-content', justifyContent);

	assertBlockData((data) => {
		expect(alignItems).to.equal(
			getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
		);

		expect(justifyContent).to.equal(
			getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
		);
	});
}

function setFlexLayoutSelectOption(axisIndex, optionLabel) {
	cy.getParentContainer('Flex Layout').within(() => {
		cy.get('button[aria-haspopup="listbox"]')
			.eq(axisIndex)
			.click({ force: true });
	});
	cy.get('[role="listbox"]:visible')
		.last()
		.within(() => {
			cy.contains(optionLabel).click({ force: true });
		});
}

const MATRIX_SPECIAL_UNITS = [
	{
		axis: 'justify',
		optionLabel: 'Space Around',
		alignItems: 'flex-start',
		justifyContent: 'space-around',
	},
	{
		axis: 'justify',
		optionLabel: 'Space Between',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	{
		axis: 'align',
		optionLabel: 'Stretch',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
	},
];

function configureBlockSpecialUnit(blockIndex, type, unit) {
	const axisIndex =
		unit.axis === 'justify'
			? getJustifyAxisSelectIndex(type)
			: getAlignAxisSelectIndex(type);

	cy.getBlock('core/paragraph').eq(blockIndex).click();
	cy.getByAriaControls('styles-view').click();

	ensureBlockDisplayFlex(blockIndex);

	cy.getParentContainer('Flex Layout').within(() => {
		cy.getByAriaLabel(type).click();
	});

	// Matrix single-click commits are deferred 200ms (dblclick detection). Wait
	// for the selected UI before changing axis selects — otherwise SelectControl
	// updates cancel the pending setValue and leave alignItems empty (`normal`).
	cy.getByDataTest('matrix-top-left-normal').click();
	cy.getByDataTest('matrix-top-left-selected').should('exist');

	setFlexLayoutSelectOption(axisIndex, unit.optionLabel);

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'align-items', unit.alignItems);

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'justify-content', unit.justifyContent);

	assertBlockData((data) => {
		expect(unit.alignItems).to.equal(
			getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
		);

		expect(unit.justifyContent).to.equal(
			getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
		);
	});
}

describe('Flex Layout → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		// change to flex
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	describe('Block toolbar interface', () => {
		beforeEach(() => {
			assertCoreLayoutToolbarSupportsRegistered();
		});

		it('should keep standard toolbar chrome and hide core layout controls on group', () => {
			openFlexGroupInBlockera();
			assertBlockToolbarInterface('core/group');
		});

		it('should keep standard toolbar chrome and hide core layout controls on columns', () => {
			openFlexColumnsInBlockera();
			assertBlockToolbarInterface('core/columns');
		});

		it('should keep standard toolbar chrome and hide core layout controls on column', () => {
			openFlexColumnInBlockera();
			assertBlockToolbarInterface('core/column');
		});
	});

	it('should update flex direction correctly on group and hide core layout toolbar', () => {
		openFlexGroupInBlockera();

		assertBlockToolbarInterface('core/group');

		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('flex-direction: row').click();
			});

		cy.getBlock('core/group').should('have.css', 'flex-direction', 'row');

		assertBlockData((data) => {
			expect('row').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		assertBlockToolbarInterface('core/group');

		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('flex-direction: column').click();
			});

		cy.getBlock('core/group').should(
			'have.css',
			'flex-direction',
			'column'
		);

		assertBlockData((data) => {
			expect('column').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		savePage();

		redirectToFrontPage();

		cy.get('.wp-block-group.blockera-block').should(
			'have.css',
			'flex-direction',
			'column'
		);
	});

	describe('Flex Align Items & Justify Content', () => {
		['flex-direction: row', 'flex-direction: column'].forEach((type) => {
			describe(type + ' Direction', () => {
				it('should apply all 9 matrix alignment points correctly', () => {
					const expectations = MATRIX_ALIGNMENT_POINTS.map((point) =>
						getMatrixFlexExpectations(
							type,
							point.rowAlign,
							point.rowJustify
						)
					);

					ensureParagraphBlockCount(9);

					cy.getBlock('core/paragraph').should('have.length', 9);

					MATRIX_ALIGNMENT_POINTS.forEach((point, index) => {
						configureBlockMatrixAlignment(index, type, point);
					});

					savePage();

					redirectToFrontPage();

					expectations.forEach(
						({ alignItems, justifyContent }, index) => {
							cy.get('p.blockera-block')
								.eq(index)
								.should('have.css', 'align-items', alignItems);

							cy.get('p.blockera-block')
								.eq(index)
								.should(
									'have.css',
									'justify-content',
									justifyContent
								);
						}
					);
				});
			});
		});

		describe('Special units, Same for row and column', () => {
			['flex-direction: row', 'flex-direction: column'].forEach(
				(type) => {
					describe(type + ' Direction', () => {
						it('should apply all special matrix units correctly', () => {
							ensureParagraphBlockCount(3);

							cy.getBlock('core/paragraph').should(
								'have.length',
								3
							);

							MATRIX_SPECIAL_UNITS.forEach((unit, index) => {
								configureBlockSpecialUnit(index, type, unit);
							});

							savePage();

							redirectToFrontPage();

							MATRIX_SPECIAL_UNITS.forEach((unit, index) => {
								cy.get('p.blockera-block')
									.eq(index)
									.should(
										'have.css',
										'align-items',
										unit.alignItems
									);

								cy.get('p.blockera-block')
									.eq(index)
									.should(
										'have.css',
										'justify-content',
										unit.justifyContent
									);
							});
						});
					});
				}
			);
		});
	});
});
