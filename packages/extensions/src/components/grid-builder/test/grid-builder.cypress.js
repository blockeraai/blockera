/**
 * Internal dependencies
 */
import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
} from '../../../../../../cypress/helpers';
import 'cypress-real-events';

const merge = (selector, x, y) => {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	return cy
		.get(selector)
		.realMouseDown()
		.realMouseMove(x, y, {
			scrollBehavior: 'bottom',
			position: 'center',
		})
		.wait(50)
		.realMouseMove(5, 5, {
			scrollBehavior: 'bottom',
			position: 'center',
		})
		.wait(50)
		.realMouseMove(5, 5, {
			scrollBehavior: 'nearest',
			position: 'center',
		})
		.wait(50)
		.realMouseUp();
};

const highlight = (selector, x, y) => {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	return cy
		.get(selector)
		.realMouseDown()
		.realMouseMove(x, y, {
			scrollBehavior: 'bottom',
			position: 'center',
		})
		.wait(50)
		.realMouseMove(5, 5, {
			scrollBehavior: 'bottom',
			position: 'center',
		})
		.wait(50)
		.realMouseMove(5, 5, {
			scrollBehavior: 'nearest',
			position: 'center',
		})
		.wait(50);
};

const resize = (selector, x, y) => {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.getByDataTest(selector)
		.realHover()
		.wait(50)
		.realMouseDown()
		.realMouseMove(x, y, { scrollBehavior: 'nearest' })
		.realMouseUp();
};

describe('Grid Builder e2e testing', () => {
	beforeEach(() => {
		cy.viewport(1440, 1025);

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');
		cy.getByAriaLabel('Settings').eq(0).click({ force: true });

		cy.getIframeBody()
			.find('[data-type="core/paragraph"]')
			.type('This is a test text.');

		cy.getByDataTest('style-tab').click();

		cy.getByAriaLabel('Grid').click();
	});

	describe('Extension', () => {
		it('close and open grid builder, when click on open button', () => {
			cy.getIframeBody()
				.find('[data-test="grid-builder"]')
				.should('exist');

			cy.getByAriaLabel('Open Grid Builder').click();
			cy.getIframeBody()
				.find('[data-test="grid-builder"]')
				.should('not.exist');

			cy.getByAriaLabel('Open Grid Builder').click();
			cy.getIframeBody()
				.find('[data-test="grid-builder"]')
				.should('exist');

			cy.getIframeBody()
				.find('[aria-label="Close Grid Builder"]')
				.click();
			cy.getIframeBody()
				.find('[data-test="grid-builder"]')
				.should('not.exist');
		});

		it('add & cut rows correctly, when enter value to row input', () => {
			// add 2 => 10
			cy.getParentContainer('Rows', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');

					// Check control
					cy.get('input[type="number"]').should('have.value', '10');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and(
							'include',
							'grid-template-rows: auto auto auto auto auto auto auto auto auto auto'
						);
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridRows = getSelectedBlock(
					data,
					'publisherGridRows'
				);

				expect({
					length: 10,
					value: [
						{
							...publisherGridRows.value[0],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[1],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[2],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[3],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[4],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[5],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[6],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[7],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[8],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[9],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridRows);

				expect(20).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// 10 => 5
			cy.getParentContainer('Rows', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '5');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and(
							'include',
							'grid-template-rows: auto auto auto auto auto'
						);
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridRows = getSelectedBlock(
					data,
					'publisherGridRows'
				);

				expect({
					length: 5,
					value: [
						{
							...publisherGridRows.value[0],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[1],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[2],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[3],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[4],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridRows);

				expect(10).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// merge
			cy.getIframeBody().find('[data-test="area5"]').trigger('click');
			cy.getIframeBody()
				.find('[data-test="area5-handler"]')
				.within(() => {
					merge('.handle.right-handle.top-handle', 75, 15);
				});

			// Check area
			getWPDataObject().then((data) => {
				const mergedArea5 = getSelectedBlock(
					data,
					'publisherGridAreas'
				).find((item) => item.name === 'area5');

				expect({
					...mergedArea5,
					'column-start': 1,
					'column-end': 3,
					'row-start': 3,
					'row-end': 4,
					mergedArea: true,
				}).to.be.deep.equal(mergedArea5);
			});

			// 5 => 6
			cy.getParentContainer('Rows', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowUp');

					// Check control
					cy.get('input[type="number"]').should('have.value', '6');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check store
			getWPDataObject().then((data) => {
				// area should not change
				const mergedArea5 = getSelectedBlock(
					data,
					'publisherGridAreas'
				).find((item) => item.name === 'area5');

				expect({
					...mergedArea5,
					'column-start': 1,
					'column-end': 3,
					'row-start': 3,
					'row-end': 4,
					mergedArea: true,
				}).to.be.deep.equal(mergedArea5);

				const publisherGridRows = getSelectedBlock(
					data,
					'publisherGridRows'
				);

				expect({
					length: 6,
					value: [
						{
							...publisherGridRows.value[0],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[1],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[2],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[3],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[4],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[5],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridRows);

				expect(11).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			cy.getParentContainer('Rows', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '3');
					cy.get('input[type="number"]').realMouseUp();

					// merge cause min for row => 3
					cy.get('input[type="number"]').should(
						'have.attr',
						'min',
						'3'
					);
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and('include', 'grid-template-rows: auto auto auto');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridRows = getSelectedBlock(
					data,
					'publisherGridRows'
				);

				expect({
					length: 3,
					value: [
						{
							...publisherGridRows.value[0],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[1],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridRows.value[2],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridRows);

				expect(5).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// unMerge
			cy.getIframeBody().find('[data-test="area5"]').trigger('click');
			cy.getIframeBody()
				.find('[data-test="area5-handler"]')
				.within(() => {
					merge('.handle.left-handle.top-handle', 350, 15);
				});

			// min => 1
			cy.getParentContainer('Rows', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '1');
					cy.get('input[type="number"]').realMouseUp();

					// normal min
					cy.get('input[type="number"]').should(
						'have.attr',
						'min',
						'1'
					);
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and('include', 'grid-template-rows: auto');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridRows = getSelectedBlock(
					data,
					'publisherGridRows'
				);

				expect({
					length: 1,
					value: [
						{
							...publisherGridRows.value[0],
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridRows);

				expect(2).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});
		});

		it('add & cut columns correctly, when enter value to column input', () => {
			// add 2 => 10
			cy.getParentContainer('Columns', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');
					cy.realPress('ArrowUp');

					// Check control
					cy.get('input[type="number"]').should('have.value', '10');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and(
							'include',
							'grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
						);
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridColumns = getSelectedBlock(
					data,
					'publisherGridColumns'
				);

				expect({
					length: 10,
					value: [
						{
							...publisherGridColumns.value[0],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[1],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[2],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[3],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[4],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[5],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[6],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[7],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[8],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[9],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridColumns);

				expect(20).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// 10 => 5
			cy.getParentContainer('Columns', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '5');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and(
							'include',
							'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
						);
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridColumns = getSelectedBlock(
					data,
					'publisherGridColumns'
				);

				expect({
					length: 5,
					value: [
						{
							...publisherGridColumns.value[0],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[1],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[2],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[3],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[4],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridColumns);

				expect(10).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// merge
			cy.getIframeBody().find('[data-test="area3"]').trigger('click');
			cy.getIframeBody()
				.find('[data-test="area3-handler"]')
				.within(() => {
					merge('.handle.left-handle.bottom-handle', 15, 75);
				});

			// Check area
			getWPDataObject().then((data) => {
				const mergedArea3 = getSelectedBlock(
					data,
					'publisherGridAreas'
				).find((item) => item.name === 'area3');

				expect({
					...mergedArea3,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 3,
					mergedArea: true,
				}).to.be.deep.equal(mergedArea3);
			});

			// 5 => 6
			cy.getParentContainer('Columns', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowUp');

					// Check control
					cy.get('input[type="number"]').should('have.value', '6');
					cy.get('input[type="number"]').realMouseUp();
				});

			// Check store
			getWPDataObject().then((data) => {
				// area should not change
				const mergedArea3 = getSelectedBlock(
					data,
					'publisherGridAreas'
				).find((item) => item.name === 'area3');

				expect({
					...mergedArea3,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 3,
					mergedArea: true,
				}).to.be.deep.equal(mergedArea3);

				const publisherGridColumns = getSelectedBlock(
					data,
					'publisherGridColumns'
				);

				expect({
					length: 6,
					value: [
						{
							...publisherGridColumns.value[0],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[1],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[2],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[3],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[4],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[5],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridColumns);

				expect(11).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			cy.getParentContainer('Columns', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '3');
					cy.get('input[type="number"]').realMouseUp();

					// merge cause min for column => 3
					cy.get('input[type="number"]').should(
						'have.attr',
						'min',
						'3'
					);
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and('include', 'grid-template-columns: 1fr 1fr 1fr');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridColumns = getSelectedBlock(
					data,
					'publisherGridColumns'
				);

				expect({
					length: 3,
					value: [
						{
							...publisherGridColumns.value[0],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[1],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
						{
							...publisherGridColumns.value[2],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridColumns);

				expect(5).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});

			// unMerge
			cy.getIframeBody().find('[data-test="area3"]').trigger('click');
			cy.getIframeBody()
				.find('[data-test="area3-handler"]')
				.within(() => {
					merge('.handle.left-handle.top-handle', 15, 350);
				});

			// min => 1
			cy.getParentContainer('Columns', 'base-control')
				.first()
				.within(() => {
					cy.get('input[type="number"]').click({ force: true });
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');
					cy.realPress('ArrowDown');

					// Check control
					cy.get('input[type="number"]').should('have.value', '1');
					cy.get('input[type="number"]').realMouseUp();

					// normal min
					cy.get('input[type="number"]').should(
						'have.attr',
						'min',
						'1'
					);
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'display: grid')
						.and('include', 'grid-template-columns: 1fr');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridColumns = getSelectedBlock(
					data,
					'publisherGridColumns'
				);

				expect({
					length: 1,
					value: [
						{
							...publisherGridColumns.value[0],
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
						},
					],
				}).to.be.deep.equal(publisherGridColumns);

				expect(2).to.be.equal(
					getSelectedBlock(data, 'publisherGridAreas').length
				);
			});
		});

		it('change grid-flow, when change direction', () => {
			/**
			 * Row
			 */
			// Check control
			cy.getByAriaLabel('Row').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'grid-template-areas: "area1 area2" "area3 area4"'
						)
						.and('include', 'grid-auto-flow: row');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridAreas = getSelectedBlock(
					data,
					'publisherGridAreas'
				);

				expect([
					{
						...publisherGridAreas[0],
						name: 'area1',
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[1],
						name: 'area2',
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[2],
						name: 'area3',
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
					},
					{
						...publisherGridAreas[3],
						name: 'area4',
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
					},
				]).to.be.deep.equal(publisherGridAreas);

				expect({ value: 'row', dense: false }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});

			/**
			 * Column
			 */
			cy.getByAriaLabel('Column').click();
			// Check control
			cy.getByAriaLabel('Column').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'grid-template-areas: "area1 area3" "area2 area4"'
						)
						.and('include', 'grid-auto-flow: column');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridAreas = getSelectedBlock(
					data,
					'publisherGridAreas'
				);

				expect([
					{
						...publisherGridAreas[0],
						name: 'area1',
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[1],
						name: 'area2',
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
					},
					{
						...publisherGridAreas[2],
						name: 'area3',
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
					},

					{
						...publisherGridAreas[3],
						name: 'area4',
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
					},
				]).to.be.deep.equal(publisherGridAreas);

				expect({ value: 'column', dense: false }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});

			// right order when merge
			cy.getIframeBody().find('[data-test="add-column"]').click();
			cy.getIframeBody().find('[data-test="area1"]').trigger('click');
			cy.getIframeBody()
				.find('[data-test="area1-handler"]')
				.within(() => {
					merge('.handle.right-handle.bottom-handle', -15, 75);
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'grid-template-areas: "area1 area2 area4" "area1 area3 area5"'
						)
						.and('include', 'grid-auto-flow: column');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridAreas = getSelectedBlock(
					data,
					'publisherGridAreas'
				);

				expect([
					{
						...publisherGridAreas[0],
						name: 'area1',
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 3,
					},
					{
						...publisherGridAreas[1],
						name: 'area2',
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[2],
						name: 'area3',
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
					},
					{
						...publisherGridAreas[3],
						name: 'area4',
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[4],
						name: 'area5',
						'column-start': 3,
						'column-end': 4,
						'row-start': 2,
						'row-end': 3,
					},
				]).to.be.deep.equal(publisherGridAreas);

				expect({ value: 'column', dense: false }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});

			// row
			cy.getByAriaLabel('Row').click();
			// Check control
			cy.getByAriaLabel('Row').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should(
							'include',
							'grid-template-areas: "area1 area2 area3" "area1 area4 area5"'
						)
						.and('include', 'grid-auto-flow: row');
				});

			// Check store
			getWPDataObject().then((data) => {
				const publisherGridAreas = getSelectedBlock(
					data,
					'publisherGridAreas'
				);

				expect([
					{
						...publisherGridAreas[0],
						name: 'area1',
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 3,
					},
					{
						...publisherGridAreas[1],
						name: 'area2',
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[2],
						name: 'area3',
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 2,
					},
					{
						...publisherGridAreas[3],
						name: 'area4',
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
					},
					{
						...publisherGridAreas[4],
						name: 'area5',
						'column-start': 3,
						'column-end': 4,
						'row-start': 2,
						'row-end': 3,
					},
				]).to.be.deep.equal(publisherGridAreas);

				expect({ value: 'row', dense: false }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});

			/**
			 * Dense
			 */
			cy.getParentContainer('Dense', 'base-control').within(() => {
				cy.get('input[type="checkbox"]').click();

				//Check control
				cy.get('input[type="checkbox"]')
					.parent()
					.should('have.class', 'is-checked');
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'grid-auto-flow: row dense');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect({ value: 'row', dense: true }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});

			// column
			cy.getByAriaLabel('Column').click();

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'grid-auto-flow: column dense');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect({ value: 'column', dense: true }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridDirection')
				);
			});
		});

		it('add align-items', () => {
			/**
			 * Center
			 */
			cy.getParentContainer('Align Items', 'base-control').within(() => {
				cy.getByAriaLabel('Center').click();

				// Check control
				cy.getByAriaLabel('Center').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'align-items: center');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('center').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridAlignItems')
				);
			});

			/**
			 * Start
			 */
			cy.getParentContainer('Align Items', 'base-control').within(() => {
				cy.getByAriaLabel('Start').click();

				// Check control
				cy.getByAriaLabel('Start').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'align-items: start');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('start').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridAlignItems')
				);
			});

			/**
			 * End
			 */
			cy.getParentContainer('Align Items', 'base-control').within(() => {
				cy.getByAriaLabel('End').click();

				// Check control
				cy.getByAriaLabel('End').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'align-items: end');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('end').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridAlignItems')
				);
			});

			/**
			 * Stretch
			 */
			cy.getParentContainer('Align Items', 'base-control').within(() => {
				cy.getByAriaLabel('Stretch').click();

				// Check control
				cy.getByAriaLabel('Stretch').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'align-items: stretch');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('stretch').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridAlignItems')
				);
			});

			/**
			 * Baseline
			 */
			cy.getParentContainer('Align Items', 'base-control').within(() => {
				cy.getByAriaLabel('Baseline').click();

				// Check control
				cy.getByAriaLabel('Baseline').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'align-items: baseline');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('baseline').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridAlignItems')
				);
			});
		});

		it('add justify-items', () => {
			/**
			 * Center
			 */
			cy.getParentContainer('Justify', 'base-control').within(() => {
				cy.getByAriaLabel('Center').click();

				// Check control
				cy.getByAriaLabel('Center').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'justify-items: center');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('center').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridJustifyItems')
				);
			});

			/**
			 * Start
			 */
			cy.getParentContainer('Justify', 'base-control').within(() => {
				cy.getByAriaLabel('Start').click();

				// Check control
				cy.getByAriaLabel('Start').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'justify-items: start');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('start').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridJustifyItems')
				);
			});

			/**
			 * End
			 */
			cy.getParentContainer('Justify', 'base-control').within(() => {
				cy.getByAriaLabel('End').click();

				// Check control
				cy.getByAriaLabel('End').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'justify-items: end');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('end').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridJustifyItems')
				);
			});

			/**
			 * Stretch
			 */
			cy.getParentContainer('Justify', 'base-control').within(() => {
				cy.getByAriaLabel('Stretch').click();

				// Check control
				cy.getByAriaLabel('Stretch').should(
					'have.attr',
					'aria-pressed',
					'true'
				);
			});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style')
						.invoke('text')
						.should('include', 'justify-items: stretch');
				});

			// Check store
			getWPDataObject().then((data) => {
				expect('stretch').to.be.deep.equal(
					getSelectedBlock(data, 'publisherGridJustifyItems')
				);
			});
		});

		it('update gap correctly, when change values', () => {
			/**
			 * Lock
			 */
			cy.getParentContainer('Gap', 'base-control')
				.first()
				.within(() => {
					cy.get('input').clear();
					cy.get('input').type(8, { force: true });

					// Check control
					cy.get('input').should('have.value', '8');
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'gap', '8px');

			// Check store
			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '8px',
					columns: '',
					rows: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'publisherGridGap'));
			});

			/**
			 * Unlock
			 */
			cy.getParentContainer('Gap', 'base-control')
				.first()
				.within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click({
						force: true,
					});

					// Check control
					cy.getParentContainer('Rows', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'8'
							);
						});
					cy.getParentContainer('Columns', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'8'
							);
						});
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'row-gap', '8px')
				.and('have.css', 'column-gap', '8px');

			// Check store
			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: '8px',
					columns: '8px',
					rows: '8px',
				}).to.be.deep.equal(getSelectedBlock(data, 'publisherGridGap'));
			});

			// change value
			cy.getParentContainer('Gap', 'base-control')
				.first()
				.within(() => {
					// Check control
					cy.getParentContainer('Rows', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').clear();
							cy.get('input[type="number"]').type(10, {
								force: true,
							});
							cy.get('input[type="number"]').realMouseUp();
						});
					cy.getParentContainer('Columns', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').clear();
							cy.get('input[type="number"]').type(15, {
								force: true,
							});
							cy.get('input[type="number"]').realMouseUp();
						});
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'row-gap', '10px')
				.and('have.css', 'column-gap', '15px');

			// Check store
			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: '8px',
					columns: '15px',
					rows: '10px',
				}).to.be.deep.equal(getSelectedBlock(data, 'publisherGridGap'));
			});

			// lock
			cy.getParentContainer('Gap', 'base-control')
				.first()
				.within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click({
						force: true,
					});

					cy.get('input[type="number"]').should('have.value', '8');
				});

			// Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'gap', '8px');

			// Check store
			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '8px',
					columns: '',
					rows: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'publisherGridGap'));
			});
		});
	});

	describe('Grid Builder', () => {
		describe('Add', () => {
			it('add one column, when pressing add button', () => {
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('not.visible');

				cy.getIframeBody().find('[data-test="add-column"]').click();

				// Check control
				cy.getParentContainer('Columns', 'base-control')
					.first()
					.within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'3'
						);
						cy.get('input[type="number"]').realMouseUp();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								'grid-template-columns: 1fr 1fr 1fr'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridColumns = getSelectedBlock(
						data,
						'publisherGridColumns'
					);

					expect({
						length: 3,
						value: [
							{
								...publisherGridColumns.value[0],
								'sizing-mode': 'normal',
								size: '1fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridColumns.value[1],
								'sizing-mode': 'normal',
								size: '1fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridColumns.value[2],
								'sizing-mode': 'normal',
								size: '1fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(publisherGridColumns);

					expect(6).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);
				});

				//Check frontend
				//TODO:
			});

			it('add one row, when pressing add button', () => {
				cy.getIframeBody().find('[data-test="add-row"]').click();

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								'grid-template-rows: auto auto auto'
							);
					});

				// Check control
				cy.getParentContainer('Rows', 'base-control')
					.first()
					.within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'3'
						);
						cy.get('input[type="number"]').realMouseUp();
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridRows = getSelectedBlock(
						data,
						'publisherGridRows'
					);

					expect({
						length: 3,
						value: [
							{
								...publisherGridRows.value[0],
								'sizing-mode': 'normal',
								size: 'auto',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridRows.value[1],
								'sizing-mode': 'normal',
								size: 'auto',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridRows.value[2],
								'sizing-mode': 'normal',
								size: 'auto',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(publisherGridRows);

					expect(6).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);
				});

				//Check frontend
				//TODO:
			});
		});

		describe('Setting', () => {
			it.skip('update column size, when resize button', () => {
				/**
				 * Normal =>Fr
				 */

				// add integer
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.within(() => {
						resize('resize-handler-left', 100, 0);

						// cy.getByDataTest('amount-normal').should(
						// 	'have.text',
						// 	(99 + 1) / 10
						// );
					});

				//Check block
				// cy.getIframeBody()
				// 	.find(`[data-type="core/paragraph"]`)
				// 	.parent()
				// 	.within(() => {
				// 		cy.get('style')
				// 			.invoke('text')
				// 			.should(
				// 				'include',
				// 				'grid-template-columns: 10fr 1fr'
				// 			);
				// 	});

				//Check store
				// getWPDataObject().then((data) => {
				// 	const updatedColumn = getSelectedBlock(
				// 		data,
				// 		'publisherGridColumns'
				// 	).value[0];

				// 	expect({
				// 		...updatedColumn,
				// 		'sizing-mode': 'normal',
				// 		size: `${(99 + 1) / 10}fr`,
				// 		'min-size': '',
				// 		'max-size': '',
				// 		'auto-fit': false,
				// 	}).to.be.deep.equal(updatedColumn);
				// });

				// have decimal
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.within(() => {
						resize('resize-handler-right', 45, 0);

						// cy.getByDataTest('amount-normal').should(
						// 	'have.text',
						// 	((45 + 1) / 10).toFixed(2)
						// );
					});

				//Check block
				// cy.getIframeBody()
				// 	.find(`[data-type="core/paragraph"]`)
				// 	.parent()
				// 	.within(() => {
				// 		cy.get('style')
				// 			.invoke('text')
				// 			.should(
				// 				'include',
				// 				'grid-template-columns: 10fr 4.60fr'
				// 			);
				// 	});

				//Check store
				// getWPDataObject().then((data) => {
				// 	const updatedColumn = getSelectedBlock(
				// 		data,
				// 		'publisherGridColumns'
				// 	).value[1];

				// 	expect({
				// 		...updatedColumn,
				// 		'sizing-mode': 'normal',
				// 		size: `${((45 + 1) / 10).toFixed(2)}fr`,
				// 		'min-size': '',
				// 		'max-size': '',
				// 		'auto-fit': false,
				// 	}).to.be.deep.equal(updatedColumn);
				// });

				// px
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.click();

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Select Unit').select('px', {
						force: true,
					});
					cy.get('input[type="number"]').clear({ force: true });
					cy.get('input[type="number"]').type(200, { force: true });
					cy.get('input[type="number"]').realMouseUp();
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.within(() => {
						resize('resize-handler-left', 45, 0);

						cy.getByDataTest('amount-normal').should(
							'have.text',
							200 + 45
						);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should(
								'include',
								'grid-template-columns: 245px 4.60fr'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridColumns'
					).value[0];

					expect({
						...updatedColumn,
						'sizing-mode': 'normal',
						size: `245px`,
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				/**
				 * Min & Max
				 */
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.click({ force: true });

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Min / Max').click({ force: true });
					cy.getParentContainer('Max', 'base-control').within(() => {
						cy.get('input[type="number"]').clear({ force: true });
						cy.get('input[type="number"]').type(1, { force: true });
						cy.get('input[type="number"]').realMouseUp();
					});
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.within(() => {
						resize('resize-handler-left', 100, 0);

						cy.getByDataTest('amount-max').should(
							'have.text',
							((100 + 1) / 10).toFixed(2)
						);

						cy.getByDataTest('amount-min').should(
							'have.text',
							'150'
						);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should(
								'include',
								'grid-template-columns: 245px minmax(150px, 10.10fr)'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridColumns'
					).value[1];

					expect({
						...updatedColumn,
						'sizing-mode': 'min/max',
						'min-size': '150px',
						'max-size': '10.10fr',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				//Check frontend
			});

			it.skip('update row size, when resize button', () => {
				//TODO: why unexpected value when vertical
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(0)
					.within(() => {
						cy.getByDataTest('resize-handler-left').should(
							'not.exist'
						);
					});

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(0)
					.click();
				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Select Unit').select('fr', {
						force: true,
					});
					cy.get('input[type="number"]').clear({ force: true });
					cy.get('input[type="number"]').type(1, { force: true });
					cy.get('input[type="number"]').realMouseUp();
				});

				// add integer

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(0)
					.within(() => {
						resize('resize-handler-left', 0, -100);
						////////////???????? useDragValue(newValue) => 40
						cy.getByDataTest('amount-normal').should(
							'have.text',
							40 / 10
						);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'grid-template-rows: 4fr auto');
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridRows'
					).value[0];

					expect({
						...updatedColumn,
						'sizing-mode': 'normal',
						size: `${40 / 10}fr`,
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				// have decimal
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.click({ force: true });
				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Select Unit').select('fr', {
						force: true,
					});
					cy.get('input[type="number"]').clear({ force: true });
					cy.get('input[type="number"]').type(1, { force: true });
					cy.get('input[type="number"]').realMouseUp();
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.within(() => {
						resize('resize-handler-left', 0, -100);

						cy.getByDataTest('amount-normal').should(
							'have.text',
							(46 / 10).toFixed(2)
						);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should(
								'include',
								'grid-template-rows: 4fr 4.60fr'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridRows'
					).value[1];

					expect({
						...updatedColumn,
						'sizing-mode': 'normal',
						size: `${(46 / 10).toFixed(2)}fr`,
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				// px
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(0)
					.click({ force: true });

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Select Unit').select('px', {
						force: true,
					});
					cy.get('input[type="number"]').clear({ force: true });
					cy.get('input[type="number"]').type(200, { force: true });
					cy.get('input[type="number"]').realMouseUp();
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(0)
					.within(() => {
						resize('resize-handler-left', 0, 45);
						////////////////////
						cy.getByDataTest('amount-normal').should(
							'have.text',
							100
						);
					});

				//Check store
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should(
								'include',
								'grid-template-rows: 100px 4.60fr'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridRows'
					).value[0];

					expect({
						...updatedColumn,
						'sizing-mode': 'normal',
						size: `100px`,
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				/**
				 * Min & Max
				 */
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.click({ force: true });

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Min / Max').click({ force: true });
					cy.getParentContainer('Max', 'base-control').within(() => {
						cy.get('input[type="number"]').clear({ force: true });
						cy.get('input[type="number"]').type(1, { force: true });
						cy.get('input[type="number"]').realMouseUp();
					});
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.within(() => {
						resize('resize-handler-left', 0, -100);

						cy.getByDataTest('amount-max').should(
							'have.text',
							(46 / 10).toFixed(2)
						);

						cy.getByDataTest('amount-min').should(
							'have.text',
							'150'
						);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should(
								'include',
								'grid-template-rows: 100px minmax(150px, 4.60fr)'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const updatedColumn = getSelectedBlock(
						data,
						'publisherGridRows'
					).value[1];

					expect({
						...updatedColumn,
						'sizing-mode': 'min/max',
						'min-size': '150px',
						'max-size': '4.60fr',
						'auto-fit': false,
					}).to.be.deep.equal(updatedColumn);
				});

				//Check frontend
				//TODO:
			});

			it('update column data by setting', () => {
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.click();

				cy.get('[data-test="popover-body"]').within(() => {
					cy.get('input[type="number"]').clear();
					cy.get('input[type="number"]').type(2);
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.should('have.text', '2fr');

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and('include', 'grid-template-columns: 1fr 2fr');
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridColumns = getSelectedBlock(
						data,
						'publisherGridColumns'
					);

					expect({
						length: 2,
						value: [
							{
								...publisherGridColumns.value[0],
								'sizing-mode': 'normal',
								size: '1fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridColumns.value[1],
								'sizing-mode': 'normal',
								size: '2fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherGridColumns')
					);
				});

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Min / Max').click({ force: true });

					cy.getParentContainer('Min', 'base-control').within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'150'
						);
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(200);
						cy.get('input[type="number"]').realMouseUp();
					});

					cy.getParentContainer('Max', 'base-control').within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'2'
						);
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(2.5);
					});
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								'grid-template-columns: 1fr minmax(200px, 2.5fr)'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridColumns = getSelectedBlock(
						data,
						'publisherGridColumns'
					);

					expect({
						length: 2,
						value: [
							{
								...publisherGridColumns.value[0],
								'sizing-mode': 'normal',
								size: '1fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridColumns.value[1],
								'sizing-mode': 'min/max',
								size: '2fr',
								'min-size': '200px',
								'max-size': '2.5fr',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherGridColumns')
					);
				});

				//Check frontend
				//TODO:
			});

			it('update row data by setting', () => {
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.click();

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Select Unit').select('fr', {
						force: true,
					});
					cy.get('input[type="number"]').clear({ force: true });
					cy.get('input[type="number"]').type(2, { force: true });
					//cy.get('input[type="number"]').realMouseUp();
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.should('have.text', '2fr');

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and('include', 'grid-template-rows: auto 2fr');
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridRows = getSelectedBlock(
						data,
						'publisherGridRows'
					);

					expect({
						length: 2,
						value: [
							{
								...publisherGridRows.value[0],
								'sizing-mode': 'normal',
								size: 'auto',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridRows.value[1],
								'sizing-mode': 'normal',
								size: '2fr',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherGridRows')
					);
				});

				cy.get('[data-test="popover-body"]').within(() => {
					cy.getByAriaLabel('Min / Max').click({ force: true });

					cy.getParentContainer('Min', 'base-control').within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'150'
						);
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(200);
						cy.get('input[type="number"]').realMouseUp();
					});

					cy.getParentContainer('Max', 'base-control').within(() => {
						cy.get('input[type="number"]').should(
							'have.value',
							'2'
						);
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(2.5);
					});
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								'grid-template-rows: auto minmax(200px, 2.5fr)'
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const publisherGridRows = getSelectedBlock(
						data,
						'publisherGridRows'
					);

					expect({
						length: 2,
						value: [
							{
								...publisherGridRows.value[0],
								'sizing-mode': 'normal',
								size: 'auto',
								'min-size': '',
								'max-size': '',
								'auto-fit': false,
							},
							{
								...publisherGridRows.value[1],
								'sizing-mode': 'min/max',
								size: '2fr',
								'min-size': '200px',
								'max-size': '2.5fr',
								'auto-fit': false,
							},
						],
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherGridRows')
					);
				});

				//Check frontend
				//TODO:
			});

			it.skip('check auto-fit enable', () => {
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.click();

				cy.get('[data-test="popover-body"]').within(() => {
					// disable
					cy.get('input[type="checkbox"]').should(
						'have.attr',
						'disabled'
					);

					//
					cy.getByAriaLabel('Select Unit').select('px', {
						force: true,
					});

					// disable because of other columns fr
					cy.get('input[type="checkbox"]').should(
						'have.attr',
						'disabled'
					);
				});

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(1)
					.click({ force: true });

				cy.get('[data-test="popover-body"]').within(() => {
					// disable
					cy.get('input[type="checkbox"]').should(
						'have.attr',
						'disabled'
					);

					//
					cy.getByAriaLabel('Select Unit').select('auto', {
						force: true,
					});

					// disable because auto
					cy.get('input[type="checkbox"]').should(
						'have.attr',
						'disabled'
					);

					cy.getByAriaLabel('Min / Max').click({ force: true });
					cy.getParentContainer('Min', 'base-control').within(() => {
						cy.getByAriaLabel('Select Unit').select('auto', {
							force: true,
						});
					});

					// disable because of minmax(auto, auto)
					cy.get('input[type="checkbox"]').should(
						'have.attr',
						'disabled'
					);
					cy.getParentContainer('Max', 'base-control').within(() => {
						cy.getByAriaLabel('Select Unit').select('fr', {
							force: true,
						});
						cy.get('input[type="number"]').type(2, { force: true });

						// disable because of minmax(auto, fr)
						cy.get('input[type="checkbox"]').should(
							'have.attr',
							'disabled'
						);
					});
				});
			});

			context('remove', () => {
				it('remove column, when there is no merged area', () => {
					cy.getIframeBody()
						.find('[data-test="size-handler-column"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').click();
					});

					// Check control
					cy.getParentContainer('Columns', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'1'
							);
							cy.get('input[type="number"]').realMouseUp();
						});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'display: grid')
								.and('include', 'grid-template-columns: 1fr');
						});

					//Check store
					getWPDataObject().then((data) => {
						const publisherGridColumns = getSelectedBlock(
							data,
							'publisherGridColumns'
						);

						expect({
							length: 1,
							value: [
								{
									...publisherGridColumns.value[0],
									'sizing-mode': 'normal',
									size: '1fr',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
								},
							],
						}).to.be.deep.equal(publisherGridColumns);

						expect(2).to.be.equal(
							getSelectedBlock(data, 'publisherGridAreas').length
						);
					});

					//Check frontend
					//TODO:
				});

				it('remove column, when there is merged area with same coordinates', () => {
					cy.getIframeBody()
						.find('[data-test="area1"]')
						.trigger('click');
					cy.getIframeBody()
						.find('[data-test="area1-handler"]')
						.within(() => {
							merge(
								'.handle.right-handle.bottom-handle',
								-15,
								25
							);
						});

					cy.getIframeBody()
						.find('[data-test="size-handler-column"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').click();
					});

					// Check control
					cy.getParentContainer('Columns', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'1'
							);
							cy.get('input[type="number"]').realMouseUp();
						});

					// Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'display: grid')
								.and('include', 'grid-template-columns: 1fr');
						});

					//Check store
					getWPDataObject().then((data) => {
						const publisherGridColumns = getSelectedBlock(
							data,
							'publisherGridColumns'
						);

						expect({
							length: 1,
							value: [
								{
									...publisherGridColumns.value[0],
									'sizing-mode': 'normal',
									size: '1fr',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
								},
							],
						}).to.be.deep.equal(publisherGridColumns);

						expect(2).to.be.equal(
							getSelectedBlock(data, 'publisherGridAreas').length
						);
					});

					//Check frontend
					//TODO:
				});

				it('do not remove column, when there is merged area', () => {
					cy.getIframeBody()
						.find('[data-test="area1"]')
						.trigger('click');
					cy.getIframeBody()
						.find('[data-test="area1-handler"]')
						.within(() => {
							merge(
								'.handle.right-handle.bottom-handle',
								25,
								-15
							);
						});

					cy.getIframeBody()
						.find('[data-test="size-handler-column"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').should(
							'have.attr',
							'disabled'
						);
					});
				});

				it('remove row, when there is no merged area', () => {
					cy.getIframeBody()
						.find('[data-test="size-handler-row"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').click();
					});

					// Check control
					cy.getParentContainer('Rows', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'1'
							);
							cy.get('input[type="number"]').realMouseUp();
						});
					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'display: grid')
								.and('include', 'grid-template-rows: auto');
						});

					//Check store
					getWPDataObject().then((data) => {
						const publisherGridRows = getSelectedBlock(
							data,
							'publisherGridRows'
						);

						expect({
							length: 1,
							value: [
								{
									...publisherGridRows.value[0],
									'sizing-mode': 'normal',
									size: 'auto',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
								},
							],
						}).to.be.deep.equal(publisherGridRows);

						expect(2).to.be.equal(
							getSelectedBlock(data, 'publisherGridAreas').length
						);
					});

					//Check frontend
					//TODO:
				});

				it('remove row, when there is merged area with same coordinates', () => {
					cy.getIframeBody()
						.find('[data-test="area1"]')
						.trigger('click');
					cy.getIframeBody()
						.find('[data-test="area1-handler"]')
						.within(() => {
							merge(
								'.handle.right-handle.bottom-handle',
								25,
								-15
							);
						});

					cy.getIframeBody()
						.find('[data-test="size-handler-row"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').click();
					});

					// Check control
					cy.getParentContainer('Rows', 'base-control')
						.first()
						.within(() => {
							cy.get('input[type="number"]').should(
								'have.value',
								'1'
							);
							cy.get('input[type="number"]').realMouseUp();
						});
					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'display: grid')
								.and('include', 'grid-template-rows: auto');
						});

					//Check store
					getWPDataObject().then((data) => {
						const publisherGridRows = getSelectedBlock(
							data,
							'publisherGridRows'
						);

						expect({
							length: 1,
							value: [
								{
									...publisherGridRows.value[0],
									'sizing-mode': 'normal',
									size: 'auto',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
								},
							],
						}).to.be.deep.equal(publisherGridRows);

						expect(2).to.be.equal(
							getSelectedBlock(data, 'publisherGridAreas').length
						);
					});

					//Check frontend
					//TODO:
				});

				it('do not remove row, when there is merged area', () => {
					cy.getIframeBody()
						.find('[data-test="area1"]')
						.trigger('click');
					cy.getIframeBody()
						.find('[data-test="area1-handler"]')
						.within(() => {
							merge(
								'.handle.right-handle.bottom-handle',
								-15,
								25
							);
						});

					cy.getIframeBody()
						.find('[data-test="size-handler-row"]')
						.eq(0)
						.click();

					cy.get('[data-test="popover-body"]').within(() => {
						cy.getByDataTest('delete').should(
							'have.attr',
							'disabled'
						);
					});
				});
			});
		});

		describe('Design', () => {
			it('highlight area, when hover column/row with same coordinates', () => {
				//Check hover first column
				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.realHover();

				cy.getIframeBody()
					.find('[data-test="area1"]')
					.should('have.attr', 'class')
					.should('include', 'hovered');
				cy.getIframeBody()
					.find('[data-test="area3"]')
					.should('have.attr', 'class')
					.should('include', 'hovered');

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.realMouseUp();

				//Check hover second row
				cy.getIframeBody()
					.find('[data-test="size-handler-row"]')
					.eq(1)
					.realHover();

				cy.getIframeBody()
					.find('[data-test="area3"]')
					.should('have.attr', 'class')
					.should('include', 'hovered');
				cy.getIframeBody()
					.find('[data-test="area4"]')
					.should('have.attr', 'class')
					.should('include', 'hovered');

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.realMouseUp();

				//check merged

				cy.getIframeBody().find('[data-test="area1"]').realClick();
				cy.getIframeBody()
					.find('[data-test="area1-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 30, -15);
					});

				cy.getIframeBody()
					.find('[data-test="size-handler-column"]')
					.eq(0)
					.realHover();

				cy.getIframeBody()
					.find('[data-test="virtual-area"]')

					.should(
						'have.css',
						'background-color',
						'rgba(20, 126, 184, 0.25)'
					);
			});

			it('highlight area, when merge', () => {
				cy.getIframeBody()
					.find('[data-test="add-column"]')
					.as('add-column');
				cy.getIframeBody().find('[data-test="add-row"]').as('add-row');
				cy.multiClick('@add-column', 2);
				cy.multiClick('@add-row', 2);

				cy.getIframeBody().find('[data-test="area3"]').realClick();
				cy.getIframeBody()
					.find('[data-test="area3-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 50, 50);
					});

				cy.getIframeBody().find('[data-test="area1"]').realClick();
				cy.getIframeBody()
					.find('[data-test="area1-handler"]')
					.within(() => {
						highlight(
							'.handle.right-handle.bottom-handle',
							350,
							-10
						);
					});

				//
				cy.getIframeBody()
					.find('[data-test="area1"]')
					.should('have.attr', 'class')
					.should('include', 'highlighted');

				cy.getIframeBody()
					.find('[data-test="area2"]')
					.should('have.attr', 'class')
					.should('include', 'highlighted');

				cy.getIframeBody()
					.find('[data-test="virtual-area"]')
					.eq(0)
					.should(
						'have.css',
						'background-color',
						'rgba(20, 126, 184, 0.7)'
					);

				cy.getIframeBody()
					.find('[data-test="virtual-area"]')
					.eq(1)
					.should(
						'have.css',
						'background-color',
						'rgba(20, 126, 184, 0.25)'
					);

				cy.getIframeBody()
					.find('[data-test="virtual-area"]')
					.eq(2)
					.should(
						'have.css',
						'background-color',
						'rgba(20, 126, 184, 0.7)'
					);

				cy.getIframeBody()
					.find('[data-test="virtual-area"]')
					.eq(3)
					.should(
						'have.css',
						'background-color',
						'rgba(20, 126, 184, 0.25)'
					);
			});

			it('gap handler should have right position, when resize and add item', () => {});
		});

		describe('Merge & UnMerge', () => {
			it('merge and unMerge areas, when resizing', () => {
				cy.getIframeBody()
					.find('[data-test="add-column"]')
					.as('add-column');
				cy.getIframeBody().find('[data-test="add-row"]').as('add-row');
				cy.multiClick('@add-column', 3);
				cy.multiClick('@add-row', 2);

				// merge 1 + 2 : right-bottom
				cy.getIframeBody().find('[data-test="area1"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area1-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 50, -15);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area4" "area5 area6 area7 area8 area9" "area10 area11 area12 area13 area14" "area15 area16 area17 area18 area19"`
							);
					});

				// Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');

					expect(19).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				// merge 15 + 14 : right-top
				cy.getIframeBody()
					.find('[data-test="area15"]')
					.trigger('click');
				cy.getIframeBody()
					.find('[data-test="area15-handler"]')
					.within(() => {
						merge('.handle.right-handle.top-handle', 500, -40);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area4" "area5 area6 area7 area8 area9" "area10 area10 area10 area10 area10" "area10 area10 area10 area10 area10"`
							);
					});

				// Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area10');

					expect(10).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 1,
						'column-end': 6,
						'row-start': 3,
						'row-end': 5,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 1,
								'column-end': 2,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 1,
								'column-end': 2,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 2,
								'column-end': 3,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 2,
								'column-end': 3,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[4],
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[5],
								'column-start': 3,
								'column-end': 4,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[6],
								'column-start': 4,
								'column-end': 5,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[7],
								'column-start': 4,
								'column-end': 5,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[8],
								'column-start': 5,
								'column-end': 6,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[9],
								'column-start': 5,
								'column-end': 6,
								'row-start': 4,
								'row-end': 5,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				// merge 4 + 3 : left-bottom
				cy.getIframeBody().find('[data-test="area4"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area4-handler"]')
					.within(() => {
						merge('.handle.left-handle.bottom-handle', -50, -10);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area6 area7 area8" "area9 area9 area9 area9 area9" "area9 area9 area9 area9 area9"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area3');

					expect(9).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 4,
						'column-end': 6,
						'row-start': 1,
						'row-end': 2,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				// merge 6 + 2 : left-top
				cy.getIframeBody().find('[data-test="area6"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area6-handler"]')
					.within(() => {
						merge('.handle.left-handle.top-handle', 10, -30);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area2 area6 area7" "area8 area8 area8 area8 area8" "area8 area8 area8 area8 area8"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					expect(8).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				/**
				 * unMerge itSelf
				 */

				// not qualified for unMerge
				cy.getIframeBody().find('[data-test="area2"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area2-handler"]')
					.within(() => {
						merge('.handle.left-handle.top-handle', 5, 5);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area2 area6 area7" "area8 area8 area8 area8 area8" "area8 area8 area8 area8 area8"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					expect(8).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				// unMerge 8 => itself
				cy.getIframeBody().find('[data-test="area8"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area8-handler"]')
					.within(() => {
						merge('.handle.left-handle.top-handle', 150, 150);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area2 area6 area7" "area8 area9 area10 area11 area12" "area13 area14 area14 area14 area14"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area14');

					expect(14).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 2,
						'column-end': 6,
						'row-start': 4,
						'row-end': 5,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 2,
								'column-end': 3,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 4,
								'column-end': 5,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 5,
								'column-end': 6,
								'row-start': 4,
								'row-end': 5,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				// unMerge 1 => itself
				cy.getIframeBody().find('[data-test="area1"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area1-handler"]')
					.within(() => {
						merge('.handle.left-handle.bottom-handle', 130, -15);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area2 area3 area4 area4" "area5 area6 area3 area7 area8" "area9 area10 area11 area12 area13" "area14 area15 area15 area15 area15"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const unMergedArea1 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');
					const unMergedArea2 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					expect(15).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...unMergedArea1,
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 2,
						mergedArea: false,
					}).to.be.deep.equal(unMergedArea1);
					expect({
						...unMergedArea2,
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						mergedArea: false,
					}).to.be.deep.equal(unMergedArea2);
				});

				/**
				 * merge with pure area
				 */

				cy.getIframeBody().find('[data-test="area4"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area4-handler"]')
					.within(() => {
						merge('.handle.left-handle.bottom-handle', 10, 60);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area2 area3 area4 area4" "area5 area6 area3 area4 area4" "area7 area8 area9 area10 area11" "area12 area13 area13 area13 area13"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area4');

					expect(13).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 4,
						'column-end': 6,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 4,
								'column-end': 5,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 5,
								'column-end': 6,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				/**
				 * merge with merged area
				 */

				cy.getIframeBody().find('[data-test="area4"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area4-handler"]')
					.within(() => {
						merge('.handle.left-handle.top-handle', -70, 20);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area2 area3 area3 area3" "area4 area5 area3 area3 area3" "area6 area7 area8 area9 area10" "area11 area12 area12 area12 area12"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area3');

					expect(12).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 3,
						'column-end': 6,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 4,
								'column-end': 5,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[4],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[5],
								'column-start': 5,
								'column-end': 6,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				/**
				 * merge pure area with pure area : has sideEffect => 2 + 8
				 */

				cy.getIframeBody().find('[data-test="area2"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area2-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 70, 150);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area2 area2 area3 area3" "area4 area2 area2 area3 area3" "area5 area2 area2 area6 area7" "area8 area9 area9 area9 area9"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					const effectedArea3 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area3');

					expect(9).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 2,
						'column-end': 4,
						'row-start': 1,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 2,
								'column-end': 3,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 2,
								'column-end': 3,
								'row-start': 3,
								'row-end': 4,
							},

							{
								...mergedArea.coordinates[3],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[4],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[5],
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
						],
					}).to.be.deep.equal(mergedArea);

					expect({
						...effectedArea3,
						'column-start': 4,
						'column-end': 6,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea3.coordinates[0],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...effectedArea3.coordinates[1],
								'column-start': 4,
								'column-end': 5,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...effectedArea3.coordinates[2],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},

							{
								...effectedArea3.coordinates[3],
								'column-start': 5,
								'column-end': 6,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(effectedArea3);
				});

				/**
				 * merge pure area with virtual area : has sideEffect =>  8 + 2
				 */

				cy.getIframeBody().find('[data-test="area8"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area8-handler"]')
					.within(() => {
						merge('.handle.right-handle.top-handle', 35, -240);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area1 area1 area2 area3 area3" "area1 area1 area2 area4 area5" "area1 area1 area6 area6 area6"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');

					const effectedArea2 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					const effectedArea6 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area6');

					expect(6).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 5,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 1,
								'column-end': 2,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 1,
								'column-end': 2,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 1,
								'column-end': 2,
								'row-start': 4,
								'row-end': 5,
							},

							{
								...mergedArea.coordinates[4],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[5],
								'column-start': 2,
								'column-end': 3,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[6],
								'column-start': 2,
								'column-end': 3,
								'row-start': 3,
								'row-end': 4,
							},
							{
								...mergedArea.coordinates[7],
								'column-start': 2,
								'column-end': 3,
								'row-start': 4,
								'row-end': 5,
							},
						],
					}).to.be.deep.equal(mergedArea);

					expect({
						...effectedArea2,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea2.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...effectedArea2.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...effectedArea2.coordinates[2],
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
						],
					}).to.be.deep.equal(effectedArea2);

					expect({
						...effectedArea6,
						'column-start': 3,
						'column-end': 6,
						'row-start': 4,
						'row-end': 5,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea6.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...effectedArea6.coordinates[1],
								'column-start': 4,
								'column-end': 5,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...effectedArea6.coordinates[2],
								'column-start': 5,
								'column-end': 6,
								'row-start': 4,
								'row-end': 5,
							},
						],
					}).to.be.deep.equal(effectedArea6);
				});

				/**
				 * merge merged area with virtual area : has sideEffect =>  1 + 3
				 */

				cy.getIframeBody().find('[data-test="area1"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area1-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 300, -290);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area1 area1 area1" "area2 area3 area4 area5 area5" "area6 area7 area4 area8 area9" "area10 area11 area12 area12 area12"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');

					const effectedArea4 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area4');

					const effectedArea5 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area5');

					expect(12).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 1,
						'column-end': 6,
						'row-start': 1,
						'row-end': 2,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[4],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
						],
					}).to.be.deep.equal(mergedArea);

					expect({
						...effectedArea4,
						'column-start': 3,
						'column-end': 4,
						'row-start': 2,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea4.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...effectedArea4.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
						],
					}).to.be.deep.equal(effectedArea4);

					expect({
						...effectedArea5,
						'column-start': 4,
						'column-end': 6,
						'row-start': 2,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea5.coordinates[0],
								'column-start': 4,
								'column-end': 5,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...effectedArea5.coordinates[1],
								'column-start': 5,
								'column-end': 6,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(effectedArea5);
				});

				/**
				 * merge merged area with virtual area : has sideEffect => effected areas separate to two
				 */

				cy.getIframeBody().find('[data-test="area4"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area4-handler"]')
					.within(() => {
						merge('.handle.right-handle.top-handle', -20, -40);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area2 area6 area6" "area7 area8 area2 area9 area10" "area11 area12 area13 area13 area13"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					const effectedArea1 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');

					const effectedArea3 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area3');

					expect(13).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
						],
					}).to.be.deep.equal(mergedArea);

					expect({
						...effectedArea1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea1.coordinates[0],
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...effectedArea1.coordinates[1],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					}).to.be.deep.equal(effectedArea1);

					expect({
						...effectedArea3,
						'column-start': 4,
						'column-end': 6,
						'row-start': 1,
						'row-end': 2,
						mergedArea: true,
						coordinates: [
							{
								...effectedArea3.coordinates[0],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...effectedArea3.coordinates[1],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
						],
					}).to.be.deep.equal(effectedArea3);
				});

				/**
				 * merge pure area with merged area : no sideEffect
				 */

				cy.getIframeBody()
					.find('[data-test="area12"]')
					.trigger('click');
				cy.getIframeBody()
					.find('[data-test="area12-handler"]')
					.within(() => {
						merge('.handle.right-handle.top-handle', 300, 10);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area2 area6 area6" "area7 area8 area2 area9 area10" "area11 area12 area12 area12 area12"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area12');

					expect(12).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 2,
						'column-end': 6,
						'row-start': 4,
						'row-end': 5,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 2,
								'column-end': 3,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 4,
								'column-end': 5,
								'row-start': 4,
								'row-end': 5,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 5,
								'column-end': 6,
								'row-start': 4,
								'row-end': 5,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				/**
				 * merge pure area with merged area : has sideEffect
				 */

				cy.getIframeBody().find('[data-test="area5"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area5-handler"]')
					.within(() => {
						merge('.handle.right-handle.bottom-handle', 50, -15);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area1 area2 area3 area3" "area4 area5 area5 area6 area6" "area7 area8 area9 area10 area11" "area12 area13 area13 area13 area13"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area5');

					expect(13).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 2,
						'column-end': 4,
						'row-start': 2,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 2,
								'column-end': 3,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);
				});

				/**
				 * merge merged area with merged area : has sideEffect => 3 + 5
				 */

				cy.getIframeBody().find('[data-test="area3"]').trigger('click');
				cy.getIframeBody()
					.find('[data-test="area3-handler"]')
					.within(() => {
						merge('.handle.left-handle.bottom-handle', -150, 40);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.parent()
					.within(() => {
						cy.get('style')
							.invoke('text')
							.should('include', 'display: grid')
							.and(
								'include',
								`grid-template-areas: "area1 area2 area2 area2 area2" "area3 area2 area2 area2 area2" "area4 area5 area6 area7 area8" "area9 area10 area10 area10 area10"`
							);
					});

				//Check store
				getWPDataObject().then((data) => {
					const mergedArea = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area2');

					const effectedArea1 = getSelectedBlock(
						data,
						'publisherGridAreas'
					).find((item) => item.name === 'area1');

					expect(10).to.be.equal(
						getSelectedBlock(data, 'publisherGridAreas').length
					);

					expect({
						...mergedArea,
						'column-start': 2,
						'column-end': 6,
						'row-start': 1,
						'row-end': 3,
						mergedArea: true,
						coordinates: [
							{
								...mergedArea.coordinates[0],
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[1],
								'column-start': 2,
								'column-end': 3,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[2],
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[3],
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[4],
								'column-start': 4,
								'column-end': 5,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[5],
								'column-start': 4,
								'column-end': 5,
								'row-start': 2,
								'row-end': 3,
							},
							{
								...mergedArea.coordinates[6],
								'column-start': 5,
								'column-end': 6,
								'row-start': 1,
								'row-end': 2,
							},
							{
								...mergedArea.coordinates[7],
								'column-start': 5,
								'column-end': 6,
								'row-start': 2,
								'row-end': 3,
							},
						],
					}).to.be.deep.equal(mergedArea);

					expect(false).to.be.equal(effectedArea1.mergedArea);
				});

				// Check frontend
				//TODO:
			});
		});

		describe('Gap', () => {
			it.skip('update gap correctly, when drag in grid-builder', () => {
				// default
				cy.getIframeBody()
					.find('[data-test="gap-handler-column"]')
					.should('have.css', 'width', '20px');
				cy.getIframeBody()
					.find('[data-test="gap-handler-row"]')
					.should('have.css', 'height', '20px');

				/**
				 * Column
				 */
				cy.getIframeBody()
					.find('[data-test="gap-handler-column"]')
					.realHover({ position: 'top' })
					.realMouseDown({ position: 'top' })
					.realMouseMove(5, 0, { position: 'top' })
					.realMouseUp({ position: 'top' });

				//TODO
				// Check control

				// Check block
				// Check store

				/**
				 * Row
				 */

				cy.getIframeBody()
					.find('[data-test="gap-handler-column"]')
					.realHover()
					.realMouseDown()
					.realMouseMove(0, 50)
					.realMouseUp();

				//TODO
				// Check control

				// Check block
				// Check store
			});
		});
	});
});
