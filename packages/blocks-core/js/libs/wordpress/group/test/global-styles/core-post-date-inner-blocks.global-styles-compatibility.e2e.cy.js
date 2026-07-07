/**
 * Group Block → Post Date Inner Block → WP Data Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

const getGroupSectionGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group']
		?.variations?.['section-1'];

describe('Group Block → Post Date Inner Block → WP Data Compatibility (Global Styles)', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(0).click();
		cy.get('button[id="/blocks/core%2Fgroup"]').click();
	});

	it('(from and to) WordPress compatible functionality testing', () => {
		cy.getByDataTest('style-section-1').click();
		cy.addNewTransition();

		setInnerBlock('core/post-date');

		getWPDataObject().then((data) => {
			const root = getGroupSectionGlobalStyles(data);
			const blockeraPostDateInnerBlock =
				root?.blockeraInnerBlocks?.value?.['core/post-date']
					?.attributes;

			expect(
				'color-mix(in srgb, currentColor 85%, transparent)'
			).to.equal(blockeraPostDateInnerBlock?.blockeraFontColor);
		});

		cy.setColorControlValue('Text Color', '666666');

		getWPDataObject().then((data) => {
			const root = getGroupSectionGlobalStyles(data);
			const blockeraPostDateInnerBlock =
				root?.blockeraInnerBlocks?.value?.['core/post-date']
					?.attributes;

			expect('#666666').to.equal(
				blockeraPostDateInnerBlock?.blockeraFontColor
			);
		});

		cy.clearColorControlValue('Text Color');

		getWPDataObject().then((data) => {
			const root = getGroupSectionGlobalStyles(data);
			const blockeraPostDateInnerBlock =
				root?.blockeraInnerBlocks?.value?.['core/post-date']
					?.attributes;

			expect(undefined).to.equal(
				blockeraPostDateInnerBlock?.blockeraFontColor
			);
		});
	});
});
