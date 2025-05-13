/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Table Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:table {"hasFixedLayout":false} -->
<figure class="wp-block-table"><table><thead><tr><th>Header Cell</th><th></th></tr></thead><tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td>cell 3</td><td>cell 4</td></tr></tbody><tfoot><tr><td>Footer Cell</td><td></td></tr></tfoot></table><figcaption class="wp-element-caption">caption text...</figcaption></figure>
<!-- /wp:table -->`);

		cy.getBlock('core/table').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Edit Blocks
		//

		//
		// 1.1. Block styles
		//

		//
		// 1.1.1. Background clip & root tag test
		//
		cy.getBlock('core/table').within(() => {
			cy.get('table').should('have.css', 'background-clip', 'border-box');
		});

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		// main tag is not root
		cy.getBlock('core/table').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getBlock('core/table').within(() => {
			// inner table tag is root
			cy.get('table').should(
				'have.css',
				'background-clip',
				'padding-box'
			);
		});

		//
		// 1.1.2. Padding
		//
		setBoxSpacingSide('padding-top', 50);

		// main tag is not root
		cy.getBlock('core/table').should('have.css', 'padding-top', '50px');

		cy.getBlock('core/table').within(() => {
			cy.get('table').should('not.have.css', 'padding-top', '50px');
		});

		//
		// 1.2. Caption
		//
		setInnerBlock('elements/caption');

		cy.setColorControlValue('BG Color', '#606060');

		cy.getBlock('core/table').within(() => {
			cy.get('.wp-element-caption').should(
				'have.css',
				'background-color',
				'rgb(96, 96, 96)'
			);
		});

		//
		// 1.3. Header cells
		//
		setParentBlock();
		setInnerBlock('elements/header-cells');

		cy.setColorControlValue('BG Color', '#808080');

		cy.getBlock('core/table').within(() => {
			cy.get('thead th').should(
				'have.css',
				'background-color',
				'rgb(128, 128, 128)'
			);
		});

		//
		// 1.4. Body cells
		//
		setParentBlock();
		setInnerBlock('elements/body-cells');

		cy.setColorControlValue('BG Color', '#909090');

		cy.getBlock('core/table').within(() => {
			cy.get('tbody td').should(
				'have.css',
				'background-color',
				'rgb(144, 144, 144)'
			);
		});

		//
		// 1.5. Footer cells
		//
		setParentBlock();
		setInnerBlock('elements/footer-cells');

		cy.setColorControlValue('BG Color', '#A0A0A0');

		cy.getBlock('core/table').within(() => {
			cy.get('tfoot td').should(
				'have.css',
				'background-color',
				'rgb(160, 160, 160)'
			);
		});

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-table table').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-table').should(
			'have.css',
			'padding-top',
			'50px'
		);

		cy.get('.blockera-block.wp-block-table table').should(
			'not.have.css',
			'padding-top',
			'50px'
		);

		cy.get('.blockera-block.wp-block-table').within(() => {
			cy.get('.wp-element-caption').should(
				'have.css',
				'background-color',
				'rgb(96, 96, 96)'
			);

			cy.get('thead th').should(
				'have.css',
				'background-color',
				'rgb(128, 128, 128)'
			);

			cy.get('tbody td').should(
				'have.css',
				'background-color',
				'rgb(144, 144, 144)'
			);

			cy.get('tfoot td').should(
				'have.css',
				'background-color',
				'rgb(160, 160, 160)'
			);
		});
	});
});
