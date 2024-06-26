/// <reference types="Cypress" />

/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import 'cypress-real-events';
import '@4tw/cypress-drag-drop';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import RepeaterControl from '../index';
import { RepeaterContext } from '../context';
import { useControlContext } from '../../../context';
import { getControlValue } from '../../../store/selectors';
import { default as InputControl } from '../../input-control';
import { default as ToggleSelectControl } from '../../toggle-select-control';
import AccordionCustomOpenIcon from './icons/accordion-custom-open-icon';
import AccordionCustomCloseIcon from './icons/accordion-custom-close-icon';

function RepeaterFilledItemChildren({ itemId, item }) {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputControl
				id={getControlId(itemId, 'name')}
				type="text"
				label={__('Name', 'blockera')}
				onChange={(value) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, name: value },
					})
				}
			/>
		</div>
	);
}

const RepeaterItemChildren = () => <h3>this is body section</h3>;

const RepeaterItemChildrenType = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ToggleSelectControl
				singularId={'type'}
				id={getControlId(itemId, 'type')}
				defaultValue="first"
				repeaterItem={itemId}
				options={[
					{
						label: __('First', 'blockera'),
						value: 'first',
					},
					{
						label: __('Second', 'blockera'),
						value: 'second',
					},
				]}
				label={__('Type', 'blockera')}
				onChange={(type, ref) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, type },
					})
				}
			/>
		</div>
	);
};

describe('repeater control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('popover', () => {
		describe('Add', () => {
			it('should add new item into repeater selectable', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={() => (
								<RepeaterItemChildren />
							)}
							defaultRepeaterItemValue={{
								selectable: true,
								isOpen: true,
							}}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 7);

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.values(getControlValue(name, STORE_NAME))
					).to.have.length(7);
				});
			});

			it('should generate correct id, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				// Check control
				cy.getByDataCy('repeater-item').should('have.length', 4);

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.keys(getControlValue(name, STORE_NAME))
					).to.be.deep.equal([
						'first-0',
						'first-1',
						'first-2',
						'first-3',
					]);
				});
			});

			it('should have correct order, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': {
							...value['first-0'],
							order: 0,
							type: 'first',
						},
						'first-1': {
							...value['first-1'],
							order: 1,
							type: 'first',
						},
						'first-2': {
							...value['first-2'],
							order: 2,
							type: 'first',
						},
						'first-3': {
							...value['first-3'],
							order: 3,
							type: 'first',
						},
					});
				});
			});

			it('should generate correct id, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildren}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				// Check control
				cy.getByDataCy('repeater-item').should('have.length', 4);

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.keys(getControlValue(name, STORE_NAME))
					).to.be.deep.equal(['0', '1', '2', '3']);
				});
			});

			it('should have correct order, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterItemChildren}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						0: {
							...value['0'],
							order: 0,
						},
						1: {
							...value['1'],
							order: 1,
						},
						2: {
							...value['2'],
							order: 2,
						},
						3: {
							...value['3'],
							order: 3,
						},
					});
				});
			});
		});

		describe('Change', () => {
			it('should generate correct id, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
						/>
					),
					value: {
						'first-0': {
							isOpen: true,
							type: 'first',
							order: 0,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.getByAriaLabel('Second').click();

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.keys(getControlValue(name, STORE_NAME))
					).to.be.deep.equal(['second-0']);
				});
			});

			it('should generate correct id, when there is type(add multiple)', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
						/>
					),
					value: {
						'first-0': {
							type: 'first',
							order: 0,
						},
						'first-1': {
							type: 'first',
							order: 1,
						},
						'first-2': {
							type: 'first',
							order: 2,
						},
						'first-3': {
							type: 'first',
							order: 3,
						},
						'first-4': {
							type: 'first',
							order: 4,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('repeater-item').eq(2).click();
				cy.getByAriaLabel('Second').click();

				// Check Control
				cy.getByDataCy('repeater-item')
					.invoke('text')
					.should('include', 'Item second 0');

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.keys(getControlValue(name, STORE_NAME))
					).to.be.deep.equal([
						'first-0',
						'first-1',
						'second-0',
						'first-2',
						'first-3',
					]);
				});
			});

			it('should update data', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterFilledItemChildren}
						/>
					),
					value: {
						0: { name: 'name1' },
						1: { name: 'name2' },
						2: { name: 'name3' },
					},
					store: STORE_NAME,
					name,
				});

				// update second one
				cy.getByDataCy('repeater-item').eq(1).click();
				cy.get('input[type="text"]').clear({ force: true });
				cy.get('input[type="text"]').type('test');

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						0: { ...value['0'], name: 'name1' },
						1: { ...value['1'], name: 'test' },
						2: { ...value['2'], name: 'name3' },
					});
				});
			});
		});

		describe('Remove', () => {
			it('should regenerate ids, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
						/>
					),
					value: {
						'first-0': { type: 'first', order: 0 },
						'first-1': { type: 'first', order: 1 },
						'first-2': { type: 'first', order: 2, x: 'y' },
						'first-3': { type: 'first', order: 3 },
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						// delete button only is shown on hover
						cy.getByAriaLabel('Delete first 1').should(
							'not.be.visible'
						);
					});

				//remove second one
				cy.getByDataCy('repeater-item').eq(1).realHover();
				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						cy.getByAriaLabel('Delete first 1').should(
							'be.visible'
						);
						cy.getByAriaLabel('Delete first 1').click();
					});

				// Check Control
				cy.getByDataCy('repeater-item').should('have.length', 3);

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': {
							...value['first-0'],
							order: 0,
							type: 'first',
						},
						'first-1': {
							...value['first-1'],
							order: 1,
							type: 'first',
							x: 'y',
						},
						'first-2': {
							...value['first-2'],
							order: 2,
							type: 'first',
						},
					});
				});
			});

			it('should regenerate order, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick(`[aria-label="Add New Item"]`, 5);

				// change type
				cy.getByDataCy('repeater-item').eq(1).click();
				cy.getByAriaLabel('Second').click({ multiple: true });

				// open repeater item popover
				cy.getByDataCy('repeater-item').eq(2).click();

				//remove second one
				cy.getByDataCy('repeater-item').eq(2).realHover();
				cy.getByDataCy('repeater-item')
					.eq(2)
					.within(() => {
						cy.getByAriaLabel('Delete second 1').should(
							'be.visible'
						);
						cy.getByAriaLabel('Delete second 1').click();
					});

				// repeater item popover should be removed
				cy.get('.components-popover').should('not.exist');

				// Check Control
				cy.getByDataCy('repeater-item').should('have.length', 4);

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': {
							...value['first-0'],
							order: 0,
						},
						'second-0': {
							...value['second-0'],
							order: 1,
						},
						'first-1': {
							...value['first-1'],
							order: 2,
						},
						'first-2': {
							...value['first-2'],
							order: 3,
						},
					});
				});
			});

			it('should regenerate ids, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterItemChildren}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				//remove second one
				cy.getByDataCy('repeater-item').eq(1).realHover();
				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						cy.getByAriaLabel('Delete 1').should('be.visible');
						cy.getByAriaLabel('Delete 1').click();
					});

				// Check Control
				cy.getByDataCy('repeater-item').should('have.length', 3);

				// Check data provider value!
				cy.then(() => {
					expect(
						Object.keys(getControlValue(name, STORE_NAME))
					).to.be.deep.equal(['0', '1', '2']);
				});
			});

			it('should regenerate order, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterItemChildren}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				//remove second one
				cy.getByDataCy('repeater-item').eq(1).realHover();
				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						cy.getByAriaLabel('Delete 1').should('be.visible');
						cy.getByAriaLabel('Delete 1').click();
					});

				// Check Control
				cy.getByDataCy('repeater-item').should('have.length', 3);

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						0: {
							...value['0'],
							order: 0,
						},
						1: {
							...value['1'],
							order: 1,
						},
						2: {
							...value['2'],
							order: 2,
						},
					});
				});
			});
		});

		describe('Clone', () => {
			it('should regenerate order, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultValue={{ type: 'first' }}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: {
						'first-0': { type: 'first', order: 0 },
						'second-0': { type: 'second', order: 1 },
						'first-1': { type: 'first', order: 2 },
						'second-1': { type: 'second', order: 3 },
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						// clone button only is shown on hover
						cy.getByAriaLabel('Clone second 0').should(
							'not.be.visible'
						);
					});

				cy.getByDataCy('repeater-item').eq(1).realHover();
				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						cy.getByAriaLabel('Clone second 0').should(
							'be.visible'
						);
						cy.getByAriaLabel('Clone second 0').click();
					});

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': { ...value['first-0'], order: 0 },
						'second-0': { ...value['second-0'], order: 1 },
						'second-2': { ...value['second-1'], order: 2 },
						'first-1': { ...value['first-1'], order: 3 },
						'second-1': { ...value['second-2'], order: 4 },
					});
				});
			});

			it('should regenerate order, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultValue={{ type: 'first' }}
						/>
					),
					value: {
						0: { value: 'y', order: 0 },
						1: { value: 'x', order: 1 },
						2: { value: 'm', order: 2 },
						3: { value: 'n', order: 3 },
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('repeater-item').eq(1).realHover();
				cy.getByDataCy('repeater-item')
					.eq(1)
					.within(() => {
						cy.getByAriaLabel('Clone 1').should('be.visible');
						cy.getByAriaLabel('Clone 1').click();
					});

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						0: { ...value['0'], value: 'y', order: 0 },
						1: { ...value['1'], value: 'x', order: 1 },
						2: { ...value['2'], value: 'm', order: 3 },
						3: { ...value['3'], value: 'n', order: 4 },
						4: { ...value['4'], value: 'x', order: 2 },
					});
				});
			});
		});

		describe('Sort', () => {
			it('should regenerate id, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: { 'first-0': { order: 0, x: 'y', type: 'first' } },
					store: STORE_NAME,
					name,
				});

				cy.getByAriaLabel('Add New Item').click();
				cy.getByDataCy('repeater-item').eq(1).click();

				// from 1 => 0
				cy.getByDataCy('repeater-item')
					.eq(1)
					.drag('[data-id="first-0"]')
					.then((success) => {
						assert.isTrue(success);
					});

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': { ...value['first-0'], order: 0 },
						'first-1': { ...value['first-1'], order: 1, x: 'y' },
					});
				});
			});

			it('should regenerate order, when there is type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							popoverTitle="Popover Title"
							repeaterItemChildren={RepeaterItemChildrenType}
							defaultValue={{ type: 'first' }}
							defaultRepeaterItemValue={{
								type: 'first',
							}}
						/>
					),
					value: {},
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 4);

				// 4th item
				cy.getByAriaLabel('Second').click();

				cy.getByDataCy('repeater-item').eq(1).click();
				cy.getByAriaLabel('Second').click();

				// from 2 => 0
				cy.getByDataCy('repeater-item')
					.eq(1)
					.drag('[data-id="first-0"]')
					.then((success) => {
						assert.isTrue(success);
					});

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						'first-0': { ...value['first-0'], order: 1 },
						'second-0': { ...value['second-0'], order: 0 },
						'first-1': { ...value['first-1'], order: 2 },
						'second-1': { ...value['second-1'], order: 3 },
					});
				});
			});

			it('should regenerate order and id, when there is no type', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: (
						<RepeaterControl
							addNewButtonLabel="Add New Item"
							repeaterItemChildren={RepeaterItemChildren}
						/>
					),
					value: { 0: { x: 'y', order: 0 } },
					store: STORE_NAME,
					name,
				});

				cy.multiClick('[aria-label="Add New Item"]', 2);

				// from 1 => 0
				cy.getByDataCy('repeater-item')
					.eq(1)
					.drag('[data-id="0"]')
					.then((success) => {
						assert.isTrue(success);
					});

				// Check data provider value!
				cy.then(() => {
					const value = getControlValue(name, STORE_NAME);
					expect(value).to.be.deep.equal({
						0: { ...value['0'], order: 0 },
						1: { ...value['1'], order: 1, x: 'y' },
						2: { ...value['2'], order: 2 },
					});
				});
			});
		});

		it('should new item be selected in repeater selectable', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Item"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						selectable={true}
						defaultRepeaterItemValue={{
							selectable: true,
							isOpen: true,
							isSelected: true,
						}}
						valueCleanup={(value) => value}
					/>
				),
				value: {
					0: { order: 0, isSelected: true, selectable: true },
				},
				store: STORE_NAME,
				name,
			});

			// last item should be selected
			cy.getByAriaLabel('Add New Item').click();
			cy.getByDataCy('repeater-item')
				.last()
				.within(() => {
					cy.getByDataCy('control-group')
						.invoke('attr', 'class')
						.should('include', 'is-selected-item');
				});

			// add one more
			cy.getByAriaLabel('Add New Item').click();
			cy.getByDataCy('repeater-item')
				.last()
				.within(() => {
					cy.getByDataCy('control-group')
						.invoke('attr', 'class')
						.should('include', 'is-selected-item');
				});

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(3);
			});
		});

		it('should add new item', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
					/>
				),
				value: {},
				store: STORE_NAME,
				name,
			});

			cy.multiClick(`[aria-label="Add New Items"]`, 7);

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 7);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(7);
			});
		});

		it('should add new item into repeater selectable', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						defaultRepeaterItemValue={{
							selectable: true,
							isOpen: true,
						}}
					/>
				),
				value: {},
				store: STORE_NAME,
				name,
			});
			cy.multiClick(`[aria-label="Add New Items"]`, 7);

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 7);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(7);
			});
		});

		it('should selected repeater first item', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						defaultRepeaterItemValue={{
							selectable: true,
							isOpen: false,
						}}
					/>
				),
				value: {
					0: {
						isSelected: true,
						selectable: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('control-group')
				.first()
				.should('have.class', 'is-selected-item');
		});

		it('should render delete item', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
					/>
				),
				value: {},
				store: STORE_NAME,
				name,
			});

			cy.multiClick('[aria-label="Add New Items"]', 3);

			let i = 1;
			while (i <= 2) {
				i++;
				cy.getByDataCy('repeater-item').eq(0).realHover();
				cy.getByDataCy('repeater-item')
					.eq(0)
					.within(() => {
						cy.get('[aria-label="Delete 0"]').click();
					});
			}

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 1);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(1);
			});
		});

		it('should render copy item', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
					/>
				),
				value: {},
				store: STORE_NAME,
				name,
			});

			cy.multiClick('[aria-label="Add New Items"]', 2);

			let i = 1;
			while (i <= 3) {
				i++;
				cy.getByDataCy('repeater-item').eq(0).realHover();
				cy.getByDataCy('repeater-item')
					.eq(0)
					.within(() => {
						cy.get('[aria-label="Clone 0"]').click();
					});
			}

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 5);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(5);
			});
		});

		it('should render disable item', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
					/>
				),
				value: {},
				store: STORE_NAME,
				name,
			});

			cy.multiClick('[aria-label="Add New Items"]', 3);

			cy.getByDataCy('repeater-item')
				.eq(0)
				.should('have.class', 'is-active');

			cy.getByDataCy('repeater-item').eq(0).realHover();

			cy.getByDataCy('repeater-item')
				.eq(0)
				.within(() => {
					cy.get('[aria-label="Disable 0"]').click();
				});

			cy.getByDataCy('repeater-item')
				.eq(0)
				.should('have.class', 'is-inactive');

			cy.getByDataCy('repeater-item')
				.eq(1)
				.should('have.class', 'is-active');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name, STORE_NAME)['0'].isVisible).to.have
					.false;

				expect(getControlValue(name, STORE_NAME)['1'].isVisible).to.have
					.true;
			});
		});

		it('should display field in body section', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={RepeaterFilledItemChildren}
					/>
				),
				value: {
					0: {
						name: 'john doe',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').click();

			cy.get('input[type="text"]').should('have.value', 'john doe');
		});

		it('should display custom header icons', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={RepeaterItemChildren}
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
					/>
				),
				value: { 0: {} },
				store: STORE_NAME,
			});

			cy.getByDataCy('plus-svg').should('be.visible');

			cy.getByDataCy('minus-svg').should('be.visible');
		});

		it('should render max items', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={RepeaterItemChildren}
						maxItems={2}
					/>
				),
				value: {},
				store: STORE_NAME,
			});

			cy.multiClick(`[aria-label="Add New Items"]`, 5);

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 2);
		});

		it('should render min items', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						repeaterItemChildren={RepeaterItemChildren}
						minItems={3}
					/>
				),
				value: {},
				store: STORE_NAME,
			});

			cy.multiClick('[aria-label="Add New Items"]', 4);

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 4);

			cy.getByDataCy('repeater-item').eq(0).realHover();
			cy.getByDataCy('repeater-item')
				.eq(0)
				.within(() => {
					cy.get('[aria-label="Delete 0"]').click();
				});

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 3);

			cy.getByDataCy('repeater-item').eq(0).realHover();
			cy.getByDataCy('repeater-item')
				.eq(0)
				.within(() => {
					cy.get('[aria-label="Delete 0"]').should('not.exist');
				});
		});

		it('should render item is open', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={RepeaterItemChildren}
					/>
				),
				value: {
					0: {
						isVisible: true,
						isOpen: true,
					},
					1: {
						isVisible: true,
						isOpen: false,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.get('.blockera-control-group-popover').should('exist');

			// Check data provider value!
			cy.then(() => {
				return expect(
					Object.values(getControlValue(name, STORE_NAME))[0].isOpen
				).to.have.true;
			});
		});

		it('should display popover custom className', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						mode="popover"
						repeaterItemChildren={RepeaterFilledItemChildren}
						popoverClassName="custom-class"
					/>
				),
				value: {
					0: {
						name: 'john doe',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').click();

			cy.get('.blockera-control-group-popover').should(
				'have.class',
				'custom-class'
			);
		});
	});

	describe('accordion', () => {
		it('should display field in body section', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
					/>
				),
				value: {
					0: {
						name: 'john doe',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').click();

			cy.get('input[type="text"]').should('have.value', 'john doe');
		});

		it('should display more className', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						className="custom-class"
					/>
				),
				value: {
					0: {
						name: 'john doe',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('blockera-repeater-control').should(
				'have.class',
				'custom-class'
			);
		});

		it('should disable all action buttons', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New Items"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						actionButtonAdd={false}
						actionButtonVisibility={false}
						actionButtonDelete={false}
						actionButtonClone={false}
					/>
				),
				value: {
					0: {
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.get(`[aria-label="Add New Items"]`).should('not.be.exist');

			cy.get(`[aria-label="Delete 1"]`).should('not.be.exist');

			cy.get(`[aria-label="Clone 1"]`).should('not.be.exist');

			cy.get(`[aria-label="Disable 1"]`).should('not.be.exist');
		});

		it('should display label', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="My Label"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						actionButtonAdd={false}
						actionButtonVisibility={false}
						actionButtonDelete={false}
						actionButtonClone={false}
					/>
				),
				value: {
					0: {
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy(`label-control`).should('contain', 'My Label');
		});

		it('should display default values', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="My Label"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						defaultValue={{
							0: { isVisible: true },
							1: { isVisible: true },
						}}
					/>
				),
				value: {
					0: { isVisible: true },
					1: { isVisible: true },
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 2);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(2);
			});
		});

		it('should display data with data id', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="My Label"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						defaultRepeaterItemValue={{ isVisible: true }}
						id="data.myData"
					/>
				),
				value: {
					data: {
						myData: { 0: {}, 1: {} },
					},
				},
				store: STORE_NAME,
				name,
			});

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME).data.myData)
				).to.have.length(2);
			});
		});

		it('should when repeater control value is changed, then context data provider value to changed!', () => {
			const onChangeMock = cy.stub().as('onChangeMock');

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New My Label"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						onChange={onChangeMock}
					/>
				),
				store: STORE_NAME,
				value: {},
				name,
			});

			cy.multiClick(`[aria-label="Add New My Label"]`, 2);

			cy.get('@onChangeMock').should('have.been.called');
		});

		it('should when repeater control value is changed, then context data provider value to changed!', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: (
					<RepeaterControl
						addNewButtonLabel="Add New My Label"
						mode="accordion"
						repeaterItemChildren={RepeaterFilledItemChildren}
						valueCleanup={(value) => value}
					/>
				),
				store: STORE_NAME,
				value: {},
				name,
			});

			cy.multiClick(`[aria-label="Add New My Label"]`, 2);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(2);
			});
		});
	});
});
