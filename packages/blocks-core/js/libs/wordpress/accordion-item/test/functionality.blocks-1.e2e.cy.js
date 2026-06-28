/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setBlockState,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testSample } from '../../accordion/test/test-sample';

describe('Accordion Item Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testSample);

		cy.getBlock('core/accordion-heading').first().click();

		cy.getByAriaLabel('Select parent block: Accordion Item').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'open',
			'close',
			'elements/heading',
			'elements/icon',
			'elements/panel',
		]);

		cy.get('.blockera-extension-block-card.master-block-card').within(
			() => {
				cy.get('button[data-test="back-to-parent-navigation"]').should(
					'be.visible'
				);
			}
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/accordion-item')
			.first()
			.should('not.have.css', 'background-clip', 'padding-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/accordion-item')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 1.2. elements/heading
		//
		// switch to first item
		cy.getBlock('core/accordion-heading').first().click();
		cy.getByAriaLabel('Select parent block: Accordion Item').click();

		setBlockState('Normal');
		setInnerBlock('elements/heading');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-heading')
				.first()
				.should('have.css', 'color', 'rgb(0, 255, 223)');
		});

		//
		// 1.3. elements/icon
		//
		setParentBlock();
		setInnerBlock('elements/icon');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. Text color
		//
		cy.setColorControlValue('Text Color', 'b37c16');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-heading__toggle-icon')
				.first()
				.should('have.css', 'color', 'rgb(179, 124, 22)');
		});

		//
		// 1.4. elements/panel
		//
		setParentBlock();
		setInnerBlock('elements/panel');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', '00ff26');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-panel')
				.first()
				.should('have.css', 'background-color', 'rgb(0, 255, 38)');
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByAriaControls('settings-view').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-accordion-item')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.wp-block-accordion-heading')
			.first()
			.should('have.css', 'color', 'rgb(0, 255, 223)');

		cy.get('.wp-block-accordion-heading__toggle-icon')
			.first()
			.should('have.css', 'color', 'rgb(179, 124, 22)');

		cy.get('.wp-block-accordion-panel')
			.first()
			.should('have.css', 'background-color', 'rgb(0, 255, 38)');
	});
});
