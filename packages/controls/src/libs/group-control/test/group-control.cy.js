/// <reference types="Cypress" />

import GroupControl from '..';
import { default as AccordionCustomOpenIcon } from '../stories/icons/accordion-custom-open-icon';
import { default as AccordionCustomCloseIcon } from '../stories/icons/accordion-custom-close-icon';

describe('group control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('default', () => {
		it('should render header title', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
					/>
				),
			});
			cy.getByDataCy('group-control-header').should(
				'contain',
				'Header Text'
			);
			cy.get('[aria-label="Open Settings"]').should('be.visible');
		});
		it('should render initial isOpen ', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
						isOpen
					/>
				),
			});
			cy.getByDataCy('group-control-content').should('be.visible');
		});
		it('should close body section in default mode', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
					/>
				),
			});
			cy.getByDataCy('control-group').should('have.class', 'is-close');
		});
		it('should open body section after click on header', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
					/>
				),
			});
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.getByDataCy('control-group')
				.click()
				.should('have.class', 'is-open');
			cy.get('[aria-label="Close Settings"]').should('be.visible');
			cy.getByDataCy('group-control-content').should('be.visible');
			cy.getByDataCy('group-control-content').should(
				'contain',
				'Body Text'
			);
		});
	});
	describe('accordion', () => {
		it('should not displaying the border in the initial state', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
					/>
				),
			});
			cy.getByDataCy('group-control-header').click();
			cy.getByDataCy('control-group').should(
				'not.have.class',
				'toggle-open-border'
			);
		});
		it('should display border after open accordion', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
					/>
				),
			});
			cy.getByDataCy('group-control-header').click();
			cy.getByDataCy('control-group').should(
				'have.class',
				'toggle-open-border'
			);
		});
		it('should display custom icon', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
				),
			});
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[aria-label="Open Settings"]').click();
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
		it('should display extra Item Around Icon', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
					/>
				),
			});
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
		it('should display extra Item Around Icon', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
					/>
				),
			});
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
	});
	describe('popover', () => {
		it('should display popover modal', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
					/>
				),
			});
			cy.getByDataCy('control-group').and('have.class', 'is-close');
			cy.getByDataCy('group-control-header').click();
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'is-open');
		});
		it('should display popover default state is open', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverLabel="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						isOpen
					/>
				),
			});

			cy.getByDataCy('control-group').and('have.class', 'is-open');
			cy.getByDataCy('control-group').should('contain', 'Header Text');
			cy.get('.publisher-control-group-popover')
				.should('contain', 'Label Text')
				.should('contain', 'Body Text');
		});
		it('should display popover with custom icons', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverLabel="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
				),
			});
			cy.getByDataCy('control-group').should(
				'have.class',
				'toggle-open-border'
			);
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[aria-label="Open Settings"]').click();
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
		it('should display inject header buttons start and end', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverLabel="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
					/>
				),
			});
			cy.getByDataCy('control-group').should(
				'have.class',
				'toggle-open-border'
			);
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
		it('should render popover custom className', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverLabel="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
						className="custom-classname"
					/>
				),
			});
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'custom-classname');
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
		});
		it('should render close popover', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverLabel="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
						className="custom-classname"
					/>
				),
			});
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'custom-classname')
				.and('have.class', 'is-close');
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').click();
			cy.get('[aria-label="Close"]').should('be.visible');
			cy.get('[aria-label="Close"]').click();
		});
		it('should render custom popover label', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						injectHeaderButtonsStart={<AccordionCustomOpenIcon />}
						injectHeaderButtonsEnd={<AccordionCustomCloseIcon />}
						popoverLabel="👋 Popover Title"
						className="custom-classname"
						isOpen
					/>
				),
			});
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'custom-classname');
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
			cy.get('[aria-label="Close"]').should('be.visible');
			cy.get('.publisher-component-popover-header').should(
				'contain',
				'👋 Popover Title'
			);
		});
	});
});
