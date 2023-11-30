/// <reference types="Cypress" />

import { nanoid } from 'nanoid';
import { LinkControl } from '../../..';
import { getControlValue } from '../../../store/selectors';

describe('link control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('empty', () => {
		it('should display label', () => {
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
			});
			cy.getByDataCy('label-control').should('contain', 'My Label');
		});

		it('should display advance settings after click on settings', () => {
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
			});
			cy.get('[aria-label="Open Advanced Settings"]').click();
			cy.getByDataCy('label-control').should('contain', 'My Label');
			cy.getByDataCy('link-advance-setting').should('be.visible');
		});

		it('should render link input value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
				name,
			});
			const myLink = 'http://www.google.com';
			cy.get('input[placeholder="https://your-link.com"]').type(myLink);
			cy.get('input[placeholder="https://your-link.com"]').should(
				'have.value',
				myLink
			);

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).link).to.eq(myLink);
			});
		});

		it('should render open new window and NoFollow checkbox', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
				name,
			});

			const myLink = 'http://www.google.com';
			cy.get('input[placeholder="https://your-link.com"]').type(myLink);
			cy.get('[aria-label="Open Advanced Settings"]').click();

			cy.contains('label', 'Open in New Window').click();
			cy.contains('label', 'Add Nofollow').click();

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).target).to.eq(true);
			});
			cy.then(() => {
				return expect(getControlValue(name).nofollow).to.eq(true);
			});
		});

		it('should render link label', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
				name,
			});

			const myLink = 'http://www.google.com';
			cy.get('input[placeholder="https://your-link.com"]').type(myLink);
			cy.get('[aria-label="Open Advanced Settings"]').click();

			cy.get('[aria-label="Link Label"]').type('My Link Label');

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).label).to.eq(
					'My Link Label'
				);
			});
		});

		it('should render attribute select', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <LinkControl label="My Label" />,
				name,
			});

			const myLink = 'http://www.google.com';
			cy.get('input[placeholder="https://your-link.com"]').type(myLink);
			cy.get('[aria-label="Open Advanced Settings"]').click();

			cy.get('[aria-label="Add New HTML Attribute"]').click();
			cy.get('[aria-label="Add New HTML Attribute"]').click();

			cy.get('[data-cy="repeater-item"]').first().click();
			cy.get('.components-select-control__input').select('target');

			cy.getByDataCy('publisher-repeater-control').clickOutside();

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).attributes.length).to.eq(2);
			});
			cy.then(() => {
				return expect(getControlValue(name).attributes[0].__key).to.eq(
					'target'
				);
			});
			cy.then(() => {
				return expect(getControlValue(name).attributes[0].key).to.eq(
					'target'
				);
			});
			cy.then(() => {
				return expect(getControlValue(name).attributes[0].value).to.eq(
					''
				);
			});
			cy.then(() => {
				return expect(
					getControlValue(name).attributes[0].isVisible
				).to.eq(true);
			});
		});
	});

	describe('filled', () => {
		it('should  call onChange handler when component state changed', () => {
			const onChangeMock = cy.stub().as('onChangeMock');
			cy.withDataProvider({
				component: (
					<LinkControl label="My Label" onChange={onChangeMock} />
				),
			});

			cy.get('[aria-label="Open Advanced Settings"]').click();
			cy.get('@onChangeMock').should('have.been.called');
		});

		it('should display new classname', () => {
			cy.withDataProvider({
				component: (
					<LinkControl label="My Label" className="custom-class" />
				),
			});

			cy.getByDataCy('base-control').should('have.class', 'custom-class');
		});

		it('should display placeholder', () => {
			cy.withDataProvider({
				component: (
					<LinkControl
						label="My Label"
						className="custom-class"
						placeholder="Enter link"
					/>
				),
			});

			cy.get('input[placeholder="Enter link').should('exist');
		});

		it('should display default value', () => {
			const name = nanoid();
			const defaultValue = {
				link: 'http://example.com',
				target: true,
				nofollow: true,
				label: 'test label',
				attributes: [
					{
						key: 'target',
						value: '_blank',
						__key: '',
						isVisible: true,
					},
				],
			};
			cy.withDataProvider({
				component: (
					<LinkControl
						label="My Label"
						className="custom-class"
						placeholder="Enter link"
						defaultValue={defaultValue}
					/>
				),
				name,
			});

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.equal(
					defaultValue
				);
			});
		});

		it('should render advancedOpen ', () => {
			cy.withDataProvider({
				component: (
					<LinkControl
						label="My Label"
						className="custom-class"
						placeholder="Enter link"
						advancedOpen
						field="link"
					/>
				),
			});

			cy.getByDataCy('link-advance-setting').should('be.visible');
		});
	});
});
