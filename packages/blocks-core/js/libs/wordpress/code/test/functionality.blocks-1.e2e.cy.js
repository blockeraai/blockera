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

describe('Code Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:code -->
<pre class="wp-block-code"><code>Hello world <strong>bold</strong> <em>italic</em> <kbd>CMD + K</kbd> <code>const $akbar</code> <span>span</span> <mark style="background-color:#dfdfdf" class="has-inline-color">highlight</mark></code></pre>
<!-- /wp:code -->
		`);

		// Select target block
		cy.getBlock('core/code').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		cy.checkBlockStatesPickerItems([
			'elements/bold',
			'elements/italic',
			'elements/kbd',
			'elements/code',
			'elements/span',
			'elements/mark',
		]);

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/code').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/code').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/bold
		//
		setInnerBlock('elements/bold');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('Text Color', 'ff6c6c');

		//
		// 1.1.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/code').within(() => {
			cy.get('strong').should('have.css', 'color', 'rgb(255, 108, 108)');
		});

		//
		// 1.2. elements/italic
		//
		setParentBlock();
		setInnerBlock('elements/italic');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('Text Color', '6cff6c');

		//
		// 1.2.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/code').within(() => {
			cy.get('em').should('have.css', 'color', 'rgb(108, 255, 108)');
		});

		//
		// 1.3. elements/kbd
		//
		setParentBlock();
		setInnerBlock('elements/kbd');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('Text Color', '6c6cff');

		//
		// 1.3.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/code').within(() => {
			cy.get('kbd').should('have.css', 'color', 'rgb(108, 108, 255)');
		});

		//
		// 1.4. elements/code
		//
		setParentBlock();
		setInnerBlock('elements/code');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('Text Color', 'ff6cff');

		//
		// 1.4.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/code').within(() => {
			cy.get('code code').should(
				'have.css',
				'color',
				'rgb(255, 108, 255)'
			);
		});

		//
		// 1.5. elements/span
		//
		setParentBlock();
		setInnerBlock('elements/span');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.5.1. BG color
		//
		cy.setColorControlValue('Text Color', '6cff6c');

		//
		// 1.5.2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/code').within(() => {
			cy.get('span').should('have.css', 'color', 'rgb(108, 255, 108)');
		});

		//
		// 1.6. elements/mark
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
		cy.getBlock('core/code').within(() => {
			cy.get('mark').should('have.css', 'color', 'rgb(223, 223, 223)');
		});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-code').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-code').within(() => {
			cy.get('strong').should('have.css', 'color', 'rgb(255, 108, 108)');
			cy.get('em').should('have.css', 'color', 'rgb(108, 255, 108)');
			cy.get('kbd').should('have.css', 'color', 'rgb(108, 108, 255)');
			cy.get('code code').should(
				'have.css',
				'color',
				'rgb(255, 108, 255)'
			);
			cy.get('span').should('have.css', 'color', 'rgb(108, 255, 108)');
			cy.get('mark').should('have.css', 'color', 'rgb(223, 223, 223)');
		});
	});
});
