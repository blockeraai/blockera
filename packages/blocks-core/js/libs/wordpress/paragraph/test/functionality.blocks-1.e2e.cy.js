/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Paragraph Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`
		<!-- wp:paragraph -->
<p>This is a test <a href="#a">link</a> element. It include <strong>strong</strong>, <em>italic</em> , <span>span</span>, <kbd>CMD + K</kbd> key, <code>const $akbar</code> inline code and <mark style="background-color:#dfdfdf" class="has-inline-color">highlight</mark> elements.</p>
<!-- /wp:paragraph -->
		`);

		cy.getBlock('core/paragraph').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		cy.checkBlockStatesPickerItems(
			[
				'states/hover',
				'states/focus',
				'states/focus-within',
				'states/first-child',
				'states/last-child',
				'states/only-child',
				'states/empty',
				'states/before',
				'states/after',
				'elements/link',
				'elements/bold',
				'elements/italic',
				'elements/kbd',
				'elements/code',
				'elements/span',
				'elements/mark',
			],
			true
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/paragraph').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		//
		// 1.1.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			// link inner block
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 1.2. elements/bold
		//
		setParentBlock();
		setInnerBlock('elements/bold');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('Text Color', 'ff6c6c');

		//
		// 1.2.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('strong').should('have.css', 'color', 'rgb(255, 108, 108)');
		});

		//
		// 1.3. elements/italic
		//
		setParentBlock();
		setInnerBlock('elements/italic');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('Text Color', '6cff6c');

		//
		// 1.3.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('em').should('have.css', 'color', 'rgb(108, 255, 108)');
		});

		//
		// 1.4. elements/kbd
		//
		setParentBlock();
		setInnerBlock('elements/kbd');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('Text Color', '6c6cff');

		//
		// 1.4.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('kbd').should('have.css', 'color', 'rgb(108, 108, 255)');
		});

		//
		// 1.5. elements/code
		//
		setParentBlock();
		setInnerBlock('elements/code');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.5.1. BG color
		//
		cy.setColorControlValue('Text Color', 'ff6cff');

		//
		// 1.5.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('code').should('have.css', 'color', 'rgb(255, 108, 255)');
		});

		//
		// 1.6. elements/span
		//
		setParentBlock();
		setInnerBlock('elements/span');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.6.1. BG color
		//
		cy.setColorControlValue('Text Color', '6cff6c');

		//
		// 1.6.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('span').should('have.css', 'color', 'rgb(108, 255, 108)');
		});

		//
		// 1.7. elements/mark
		//
		setParentBlock();
		setInnerBlock('elements/mark');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.6.1. BG color
		//
		cy.setColorControlValue('Text Color', 'dfdfdf');

		//
		// 1.6.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			cy.get('mark').should('have.css', 'color', 'rgb(223, 223, 223)');
		});

		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			// link inner block
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// bold inner block
			cy.get('strong').should('have.css', 'color', 'rgb(255, 108, 108)');

			// italic inner block
			cy.get('em').should('have.css', 'color', 'rgb(108, 255, 108)');

			// kbd inner block
			cy.get('kbd').should('have.css', 'color', 'rgb(108, 108, 255)');

			// code inner block
			cy.get('code').should('have.css', 'color', 'rgb(255, 108, 255)');

			// span inner block
			cy.get('span').should('have.css', 'color', 'rgb(108, 255, 108)');

			// mark inner block
			cy.get('mark').should('have.css', 'color', 'rgb(223, 223, 223)');
		});
	});
});
