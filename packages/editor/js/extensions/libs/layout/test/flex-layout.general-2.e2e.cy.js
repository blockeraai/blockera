import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

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
	cy.getByDataTest('style-tab').click();

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

	getWPDataObject().then((data) => {
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
	cy.getByDataTest('style-tab').click();

	ensureBlockDisplayFlex(blockIndex);

	cy.getParentContainer('Flex Layout').within(() => {
		cy.getByAriaLabel(type).click();
	});

	cy.getByDataTest('matrix-top-left-normal').click();

	setFlexLayoutSelectOption(axisIndex, unit.optionLabel);

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'align-items', unit.alignItems);

	cy.getBlock('core/paragraph')
		.eq(blockIndex)
		.should('have.css', 'justify-content', unit.justifyContent);

	getWPDataObject().then((data) => {
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
		cy.getByDataTest('style-tab').click();

		// change to flex
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('should update flex direction correctly', () => {
		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('flex-direction: row').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'row'
		);

		getWPDataObject().then((data) => {
			expect('row').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('flex-direction: column').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'column'
		);

		getWPDataObject().then((data) => {
			expect('column').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('p.blockera-block').should(
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
