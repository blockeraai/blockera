import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setBoxSpacingSide,
	openSettingsPanel,
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

	it('should persist settings in local storage', () => {
		cy.get('button[aria-label="Block Settings"]').click();

		// Enable focus mode
		cy.getByDataTest('Focus Mode').click();

		// Save the page
		savePage();

		// Reload the page
		cy.reload();

		cy.getIframeBody().find('p[data-type="core/paragraph"]').click();

		// Check if focus mode is still enabled
		cy.get('button[aria-label="Block Settings"]').click();
		cy.getByDataTest('Focus Mode').should(
			'have.class',
			'blockera-block-menu-item-selected'
		);
	});

	it('should maintain individual section states', () => {
		// Open Background panel
		openSettingsPanel('Background');

		// Open Typography panel
		openSettingsPanel('Typography');

		// Background panel should still be open
		cy.get('.components-button.components-panel__body-toggle')
			.contains('Background')
			.should('have.attr', 'aria-expanded', 'true');

		// Typography panel should be open
		cy.get('.components-button.components-panel__body-toggle')
			.contains('Typography')
			.should('have.attr', 'aria-expanded', 'true');
	});

	it('should handle focus mode section switching', () => {
		cy.get('button[aria-label="Block Settings"]').click();
		cy.getByDataTest('Focus Mode').click();

		// Open Background panel
		openSettingsPanel('Background');

		// Open Typography panel
		openSettingsPanel('Typography');

		// Background panel should be closed
		cy.get('.components-button.components-panel__body-toggle')
			.contains('Background')
			.should('have.attr', 'aria-expanded', 'false');

		// Typography panel should be open
		cy.get('.components-button.components-panel__body-toggle')
			.contains('Typography')
			.should('have.attr', 'aria-expanded', 'true');
	});

	it('should maintain section states when switching between parent and inner blocks', () => {
		// Enable focus mode
		cy.get('button[aria-label="Block Settings"]').click();
		cy.getByDataTest('Focus Mode').click();
		// Close block settings panel
		cy.get('button[aria-label="Block Settings"]').click();

		// Add an inner block
		setInnerBlock('elements/link');

		// Open Background panel in inner block
		openSettingsPanel('Background');

		// Go back to parent block
		cy.getByDataTest('Close Inner Block').click();

		// Add an inner block
		setInnerBlock('elements/link');

		// Background panel should still be open
		cy.get('.components-button.components-panel__body-toggle')
			.contains('Background')
			.should('have.attr', 'aria-expanded', 'true');
	});

	it('should applied expand all of block sections', () => {
		cy.get('button[aria-label="Block Settings"]').click();

		cy.getByDataTest('Expand All').click();

		cy.get('button[aria-label="Block Settings"]').click();

		// Check for opened background section
		cy.getByAriaLabel('Add New Background').should('exist');
		// Check for opened border section
		cy.getByDataTest('border-control-width').should('exist');
		// Check for opened Effects section
		cy.getByAriaLabel('Add New Backdrop Filter').should('exist');

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
		cy.get('button[aria-label="Block Settings"]').click();

		cy.getByDataTest('Collapse All').click();

		cy.get('button[aria-label="Block Settings"]').click();

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
		cy.get('button[aria-label="Block Settings"]').click();

		cy.getByDataTest('Focus Mode').click();

		cy.get('button[aria-label="Block Settings"]').click();

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

		cy.getByAriaLabel('Add New Backdrop Filter').should('exist');
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

	it('should opened inner blocks while applied focus mode of block sections with navigate between inners and master', () => {
		cy.get('button[aria-label="Block Settings"]').click();

		cy.getByDataTest('Focus Mode').click();

		cy.get('button[aria-label="Block Settings"]').click();

		// Open inner blocks
		setInnerBlock('elements/link');

		// Open Background
		openSettingsPanel('Background');

		cy.getByDataTest('Close Inner Block').click();

		cy.get('button[aria-label="Block Settings"]').click();
		cy.getByDataTest('Focus Mode').click();
		cy.get('button[aria-label="Block Settings"]').click();

		// Open inner blocks
		setInnerBlock('elements/link');

		// Open Background
		openSettingsPanel('Background');

		cy.getByDataTest('Close Inner Block').click();
	});
});
