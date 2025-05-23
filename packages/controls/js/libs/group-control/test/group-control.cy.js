/// <reference types="Cypress" />

import { useState } from 'react';
import GroupControl from '..';
import { default as AccordionCustomOpenIcon } from '../stories/icons/accordion-custom-open-icon';
import { default as AccordionCustomCloseIcon } from '../stories/icons/accordion-custom-close-icon';

const Component = (props) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<GroupControl
				{...props}
				onOpen={() => setIsOpen(!isOpen)}
				isOpen={isOpen}
			/>
		</>
	);
};

Cypress.Commands.add('withGroupControl', (props) => {
	cy.withDataProvider({
		component: <Component {...props} />,
	});
});

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
		it('should open body section after click on header, when pass onClick', () => {
			cy.withGroupControl({
				mode: 'accordion',
				header: 'Header Text',
				children: 'Body Text',
				onClick: () => true,
			});

			cy.getByDataCy('group-control-header').click({ force: true });
			cy.getByDataCy('control-group').should('have.class', 'is-open');
			cy.getByAriaLabel('Close Settings').should('be.visible');
			cy.getByDataCy('group-control-content').should('be.visible');
			cy.getByDataCy('group-control-content').should(
				'contain',
				'Body Text'
			);
		});
		it('should not open body section after click on header, without onClick', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="accordion"
						header="Header Text"
						children="Body Text"
					/>
				),
			});

			cy.getByDataCy('group-control-header').click({ force: true });
			cy.getByDataCy('control-group').should('not.have.class', 'is-open');
			cy.getByAriaLabel('Close Settings').should('not.exist');
			cy.getByDataCy('group-control-content').should('not.exist');
		});
		it('should open body section after click on open button', () => {
			cy.withGroupControl({
				mode: 'accordion',
				header: 'Header Text',
				children: 'Body Text',
			});

			cy.getByDataCy('group-control-header').within(() => {
				cy.getByAriaLabel('Open Settings').click();
			});
			cy.getByDataCy('control-group').should('have.class', 'is-open');
			cy.getByAriaLabel('Close Settings').should('be.visible');
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
			cy.withGroupControl({
				mode: 'accordion',
				header: 'Header Text',
				children: 'Body Text',
				headerOpenIcon: <AccordionCustomOpenIcon />,
				headerCloseIcon: <AccordionCustomCloseIcon />,
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
		it('should display popover modal by clicking group-control-header, when pass onClick', () => {
			cy.withGroupControl({
				mode: 'accordion',
				header: 'Header Text',
				children: 'Body Text',
				toggleOpenBorder: true,
				onClick: () => true,
			});
			cy.getByDataCy('control-group').and('have.class', 'is-close');
			cy.getByDataCy('group-control-header').click();
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'is-open');
		});
		it('should not display popover modal by clicking group-control-header, without onClick', () => {
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
			cy.getByDataCy('control-group').should('not.have.class', 'is-open');
		});
		it('should display popover modal by clicking setting button', () => {
			cy.withGroupControl({
				mode: 'popover',
				header: 'Header Text',
				children: 'Body Text',
				toggleOpenBorder: true,
			});
			cy.getByDataCy('control-group').and('have.class', 'is-close');
			cy.getByAriaLabel('Open Settings').click();
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'is-open');
		});
		it('should display popover default state is open', () => {
			cy.withDataProvider({
				component: (
					<GroupControl
						mode="popover"
						popoverTitle="Label Text"
						header="Header Text"
						children="Body Text"
						toggleOpenBorder
						isOpen
					/>
				),
			});

			cy.getByDataCy('control-group').and('have.class', 'is-open');
			cy.getByDataCy('control-group').should('contain', 'Header Text');
			cy.get('.blockera-control-group-popover')
				.should('contain', 'Label Text')
				.should('contain', 'Body Text');
		});
		it('should display popover with custom icons', () => {
			cy.withGroupControl({
				mode: 'popover',
				header: 'Header Text',
				children: 'Body Text',
				popoverTitle: 'Label Text',
				toggleOpenBorder: true,
				headerOpenIcon: <AccordionCustomOpenIcon />,
				headerCloseIcon: <AccordionCustomCloseIcon />,
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
						popoverTitle="Label Text"
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
						popoverTitle="Label Text"
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
			cy.withGroupControl({
				mode: 'popover',
				header: 'Header Text',
				children: 'Body Text',
				popoverTitle: 'Label Text',
				toggleOpenBorder: true,
				className: 'custom-classname',
				injectHeaderButtonsStart: <AccordionCustomOpenIcon />,
				injectHeaderButtonsEnd: <AccordionCustomCloseIcon />,
			});
			cy.getByDataCy('control-group')
				.should('have.class', 'toggle-open-border')
				.and('have.class', 'custom-classname')
				.and('have.class', 'is-close');
			cy.get('[data-cy="plus-svg"]').should('be.visible');
			cy.get('[data-cy="minus-svg"]').should('be.visible');
			cy.get('[aria-label="Open Settings"]').click();
			cy.get('[aria-label="Close"]').should('be.visible');
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
						popoverTitle="👋 Popover Title"
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
			cy.get('.blockera-component-popover-header').should(
				'contain',
				'👋 Popover Title'
			);
		});
	});
});
