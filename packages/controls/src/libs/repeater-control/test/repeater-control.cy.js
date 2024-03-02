/// <reference types="Cypress" />

/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import RepeaterControl from '../index';
import { RepeaterContext } from '../context';
import { useControlContext } from '../../../context';
import { getControlValue } from '../../../store/selectors';
import { default as InputControl } from '../../input-control';
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
				label={__('Name', 'publisher-core')}
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

describe('repeater control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('popover', () => {
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

			cy.getByDataCy('publisher-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 7);

			// Check data provider value!
			cy.then(() => {
				expect(
					Object.values(getControlValue(name, STORE_NAME))
				).to.have.length(7);
			});
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
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Delete"]').first().click();
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Delete"]').first().click();

			cy.getByDataCy('publisher-repeater-control')
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
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Clone"]').first().click();
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Clone"]').first().click();
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Clone"]').first().click();

			cy.getByDataCy('publisher-repeater-control')
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
				.first()
				.should('have.class', 'is-active');
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label="Disable 1"]').click();

			cy.getByDataCy('repeater-item')
				.first()
				.should('have.class', 'is-inactive');

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name, STORE_NAME)['0'].isVisible)
					.to.have.false;
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
						maxItems={4}
					/>
				),
				value: {},
				store: STORE_NAME,
			});
			cy.multiClick(`[aria-label="Add New Items"]`, 5);
			cy.getByDataCy('publisher-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 4);
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

			cy.getByDataCy('publisher-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 4);
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label~="Delete"]').first().click();
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.get('[aria-label="Delete 1"]').should('not.exist');
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
			cy.get('.publisher-control-group-popover').should('exist');

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
			cy.getByDataCy('repeater-item').first().click();
			cy.get('.publisher-control-group-popover').should(
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
			cy.getByDataCy('publisher-repeater-control').should(
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
			cy.getByDataCy('publisher-repeater-control')
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
					/>
				),
				store: STORE_NAME,
				value: {},
				name,
			});

			cy.multiClick(`[aria-label="Add New My Label"]`, 2);

			// Check data provider value!
			cy.then(() => {
				const value = {
					0: {
						isOpen: false,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						isSelected: false,
						selectable: false,
						visibilitySupport: true,
						order: 0,
					},
					1: {
						isOpen: false,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						isSelected: false,
						selectable: false,
						visibilitySupport: true,
						order: 1,
					},
				};
				expect(value).to.deep.eq(getControlValue(name, STORE_NAME));
			});
		});
	});
});
