import {
	savePage,
	createPost,
	appendBlocks,
	deSelectBlock,
	addBlockToPost,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Icon Block → Functionality + Visual Test', () => {
	beforeEach(() => {
		createPost();
	});

	it('Icon block functionality + visual test', () => {
		/**
		 * 0. Add wrapper group block
		 */
		addBlockToPost('core/group/group');

		cy.getBlock('core/group').last().click();

		cy.getIframeBody()
			.find('[aria-label="Group: Gather blocks in a container."]')
			.click();

		setBoxSpacingSide('padding-top', 50);
		setBoxSpacingSide('padding-right', 50);
		setBoxSpacingSide('padding-left', 50);
		setBoxSpacingSide('padding-bottom', 100);

		/**
		 * 1. Simple and clean icon
		 */
		addBlockToPost(
			'core/image/blockera/icon',
			false,
			false,
			'.block-editor-button-block-appender'
		);

		// select image block
		cy.getBlock('core/image').last().click();

		/**
		 * 2. Select icon and change color
		 */

		// Switch to parent block
		cy.getByAriaLabel('Select Group').click();

		addBlockToPost(
			'core/image/blockera/icon',
			false,
			false,
			'.block-editor-inserter__toggle'
		);

		cy.getBlock('core/image').last().click();

		cy.getByDataTest('settings-tab').click();

		cy.getByAriaLabel('Icon Library').click({ force: true });

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-card Icon').click();
			});

		cy.setColorControlValue('Color', '0C3EF1');

		/**
		 * 3. Select icon and use rotation button
		 */
		// Switch to parent block
		cy.getByAriaLabel('Select Group').click();

		addBlockToPost(
			'core/image/blockera/icon',
			false,
			false,
			'.block-editor-inserter__toggle'
		);

		cy.getBlock('core/image').last().click();

		cy.getByDataTest('settings-tab').click();

		cy.getByAriaLabel('Icon Library').click({ force: true });

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('at-symbol Icon').click();
			});

		cy.setColorControlValue('Color', 'C22A2A');

		cy.getByAriaLabel('Rotate').click({ force: true });
		cy.getByAriaLabel('Flip Horizontal').click({ force: true });
		cy.getByAriaLabel('Flip Vertical').click({ force: true });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Width').within(() => {
			cy.get('input').clear({ force: true });
			cy.get('input').type(150, { force: true });
		});

		//
		// 4. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');

			cy.get(
				'.components-tools-panel:not(.block-editor-bindings__panel)'
			).within(() => {
				cy.get('.components-input-control__label')
					.contains('Aspect ratio')
					.should('exist')
					.should('not.be.visible');

				cy.get('.components-input-control__label')
					.contains('Width')
					.should('exist')
					.should('not.be.visible');

				cy.get('.components-input-control__label')
					.contains('Height')
					.should('exist')
					.should('not.be.visible');
			});
		});

		/**
		 * 5. Visual test in editor
		 */
		deSelectBlock();

		cy.getBlock('core/group').first().compareSnapshot({
			name: '1-editor',
			testThreshold: 0.02,
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		// disable wp navbar to avoid screenshot issue
		cy.get('#wpadminbar').invoke('css', 'position', 'relative');

		cy.get('.wp-block-group.blockera-block').first().compareSnapshot({
			name: '1-frontend',
			testThreshold: 0.02,
		});
	});
});
