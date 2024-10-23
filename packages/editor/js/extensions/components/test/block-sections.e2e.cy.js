import {
	openInserterInnerBlock,
	setBoxSpacingSide,
	appendBlocks,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Sections Manager Testing', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
	});

	it('should applied expand all of block sections', () => {
		cy.getByAriaLabel('Block Settings').click();

		cy.getByDataTest('Expand All').click();

		// Check for opened background section
		cy.getByAriaLabel('Add New Background').should('exist');
		// Check for opened border section
		cy.getByDataTest('border-control-width').should('exist');
		// Check for opened Effects section
		cy.getByAriaLabel('Add New Backdrop Filter').should('exist');
		// Check for opened InnerBlocks section
		openInserterInnerBlock('disabled');
		// Check for opened Layout section
		cy.getParentContainer('Display').should('exist');
		// Check for opened Position section
		cy.getParentContainer('Position').should('exist');
		// Check for opened Size section
		cy.getParentContainer('Width').should('exist');
		// Check for opened Spacing section
		setBoxSpacingSide('margin-top', 10);
		// Check for opened Typography section
		cy.getParentContainer('Family').should('exist');
	});

	it('should applied collapse all of block sections', () => {
		cy.getByAriaLabel('Block Settings').click();

		cy.getByDataTest('Collapse All').click();

		// Check for opened background section
		cy.getByAriaLabel('Add New Background').should('not.exist');
		// Check for opened border section
		cy.getByDataTest('border-control-width').should('not.exist');
		// Check for opened Effects section
		cy.getByAriaLabel('Add New Backdrop Filter').should('not.exist');
		// Check for opened InnerBlocks section
		cy.get('button').contains('Add Inner Block').should('not.exist');
		// Check for opened Layout section
		cy.get(`[aria-label="Display"]`).should('not.exist');
		// Check for opened Position section
		cy.get(`[aria-label="Position"]`).should('not.exist');
		// Check for opened Size section
		cy.get(`[aria-label="Width"]`).should('not.exist');
		// Check for opened Spacing section
		cy.get(
			`[data-cy="box-spacing-margin-top"] [data-cy="label-control"]`
		).should('not.exist');
		// Check for opened Typography section
		cy.get(`[aria-label="Family"]`).should('not.exist');
	});

	it.only('should applied focus mode of block sections', () => {
		cy.getByAriaLabel('Block Settings').click();

		cy.getByDataTest('Focus Mode').click();

		// Check for opened Spacing section by default!
		cy.get(
			`[data-cy="box-spacing-margin-top"] [data-cy="label-control"]`
		).should('exist');

		// Check for opened background and closed spacing.
		cy.get('.components-panel__body').contains('Background').click();
		cy.get(
			`[data-cy="box-spacing-margin-top"] [data-cy="label-control"]`
		).should('not.exist');
		// Check for opened border section
		cy.get('.components-panel__body').contains('Border And Shadow').click();
		cy.getByAriaLabel('Add New Background').should('not.exist');
		// Check for opened Effects section
		cy.get('.components-panel__body').contains('Effects').click();
		cy.getByDataTest('border-control-width').should('not.exist');
		// Check for opened InnerBlocks section
		cy.get('.components-panel__body').contains('Inner Blocks').click();
		cy.getByAriaLabel('Add New Backdrop Filter').should('not.exist');
		// Check for opened Layout section
		cy.get('.components-panel__body').contains('Layout').click();
		cy.get('button').contains('Add Inner Block').should('not.exist');
		// Check for opened Position section
		cy.get('.components-panel__body').contains('Position').click();
		cy.get(`[aria-label="Display"]`).should('not.exist');
		// Check for opened Size section
		cy.get('.components-panel__body').contains('Size').click();
		cy.get(`[aria-label="Position"]`).should('not.exist');
		// Check for opened Typography section
		cy.get('.components-panel__body').contains('Typography').click();
		cy.get(`[aria-label="Width"]`).should('not.exist');
	});
});
