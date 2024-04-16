/**
 * Internal dependencies
 */
import { addBlockToPost, createPost } from '../../../../../../cypress/helpers';

describe('Border and Shadow extension', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getIframeBody()
			.find(`[data-type="core/paragraph"]`)
			.type('Hello World!');
	});

	describe('state-container', () => {
		it('Set the "Normal" state color on the root of the container using CSS variables.', () => {
			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#147EB8');
		});
		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			cy.getByAriaLabel('Add New Block States').click();

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});
	});

	describe('current-state', () => {
		it('Set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			cy.getByAriaLabel('Add New Block States').click();

			//In this assertion not available data attribute for this selector، Please don't be sensitive.
			cy.get('button')
				.contains('Advanced')
				.parent()
				.parent()
				.should('have.class', 'publisher-not-allowed');
		});

		it('Set the current state when add new block states', () => {
			cy.getByAriaLabel('Block Current State').contains('Normal');

			cy.getByAriaLabel('Add New Block States').click();

			cy.getByAriaLabel('Block Current State').contains('Hover');

			cy.getByAriaLabel('Add New Block States').click();

			cy.getByAriaLabel('Block Current State').contains('Active');

			cy.getByAriaLabel('Add New Block States').click();

			cy.getByAriaLabel('Block Current State').contains('Focus');
		});
	});
});
