/// <reference types="Cypress" />

import { useControlContext } from '../../../context';
import { InputControl } from '../../input-control';
import { STORE_NAME } from '../../repeater-control/store';
import { RepeaterContext } from '../context';
import RepeaterControl from '../index';
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
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
//Delete 2 Clone 2 Disable 2
describe('repeater control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('popover -> empty', () => {
		it('should add new item', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						storeName={STORE_NAME}
					/>
				),
				value: [],
				store: STORE_NAME,
			});
			cy.multiClick(`[aria-label="Add New Items"]`, 7);
			// cy.getByDataCy('repeater-item');
			cy.getByDataCy('publisher-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 7);
		});
		it('should render delete item', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						storeName={STORE_NAME}
					/>
				),
				value: [],
				store: STORE_NAME,
			});
			cy.multiClick('[aria-label="Add New Items"]', 3);
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.multiClick('[aria-label="Delete 1"]', 3);
		});
		it('should render copy item', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						storeName={STORE_NAME}
					/>
				),
				value: [],
				store: STORE_NAME,
			});
			cy.multiClick('[aria-label="Add New Items"]', 2);
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.getByDataCy('repeater-item').first().realHover('mouse');
			cy.multiClick('[aria-label="Clone 1"]', 3);
			cy.getByDataCy('publisher-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 5);
		});
		it('should render disable item', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={() => <RepeaterItemChildren />}
						storeName={STORE_NAME}
					/>
				),
				value: [],
				store: STORE_NAME,
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
		});
	});
	describe('popover -> filled', () => {
		it('should display field in body section', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={RepeaterFilledItemChildren}
						storeName={STORE_NAME}
					/>
				),
				value: [
					{
						name: 'john doe',
						isVisible: true,
					},
				],
				store: STORE_NAME,
			});
			cy.getByDataCy('repeater-item').click();
			cy.get('input[type="text"]').should('have.value', 'john doe');
		});
	});
	describe('popover -> custom header', () => {
		it('should display custom header icons', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={RepeaterItemChildren}
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
						storeName={STORE_NAME}
					/>
				),
				value: [{}],
				store: STORE_NAME,
			});
			cy.getByDataCy('plus-svg').should('be.visible');
			cy.getByDataCy('minus-svg').should('be.visible');
		});
	});
});
