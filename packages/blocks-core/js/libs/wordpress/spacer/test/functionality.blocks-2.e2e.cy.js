/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacer Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:spacer {"height":"200px"} -->
<div style="height:200px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
		`);

		// Select target block
		cy.getBlock('core/spacer').click({ force: true });

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		cy.checkBlockSections(
			[
				'advanced-settings',
				'spacing',
				'typography',
				'background',
				'border-and-shadow',
				'effects',
				'layout',
				'position',
				'mouse',
				'flex-child',
			],
			'not.exist'
		);

		// activate min width
		cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/spacer').should('have.css', 'min-width', '0px');

		cy.getParentContainer('Min').within(() => {
			cy.get('input').type(10);
		});

		cy.getBlock('core/spacer').should('have.css', 'min-width', '10px');

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('not.be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-spacer').should(
			'have.css',
			'min-width',
			'10px'
		);
	});
});
