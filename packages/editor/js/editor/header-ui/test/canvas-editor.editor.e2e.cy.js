/**
 * Blockera dependencies
 */
import {
	createPost,
	goTo,
	appendBlocks,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

/**
 * We should test to checking hide WordPress breakpoint and post preview elements and rendering canvas editor at the top bar.
 *
 * Our target of below tests is just ensure of correctly working portal and observer apis.
 */
describe('Canvas editor testing', () => {
	it('should hidden WordPress post preview and breakpoint drop down elements', () => {
		createPost();

		cy.get('a[aria-label="View Post"]').should('not.exist');
		cy.get('.editor-preview-dropdown').should(
			'have.css',
			'display',
			'none'
		);
	});

	it('should rendered blockera canvas editor at the header top bar of Post Editor', () => {
		createPost();

		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});

	/**
	 * Site Editor: start in browse/navigation (no `canvas=edit`), enter block editor by clicking the
	 * preview canvas iframe, exit via “Open Navigation”, then re-enter block editor from the iframe again.
	 */
	it('should render blockera canvas editor after switching between canvas edit and navigation', () => {
		const siteEditorBrowseUrl = '/wp-admin/site-editor.php?p=%2F';

		const waitForCanvasEditReady = () => {
			cy.get('iframe[name="editor-canvas"]', { timeout: 30000 }).should(
				'be.visible'
			);
			cy.getByDataTest('blockera-canvas-editor', {
				timeout: 30000,
			}).should('exist');
		};

		/** Clicks the site preview / editor canvas frame to switch into block (canvas edit) mode. */
		const enterBlockEditorFromCanvasFrame = () => {
			cy.getIframeBody()
				.find('main', { timeout: 20000 })
				.should('be.visible')
				.click({ force: true });
			cy.url({ timeout: 20000 }).should('include', 'canvas=edit');
		};

		goTo(siteEditorBrowseUrl).then(() => {
			closeWelcomeGuide();
		});

		cy.url().should('not.include', 'canvas=edit');

		cy.get('iframe[name="editor-canvas"]', { timeout: 30000 }).should(
			'be.visible'
		);

		enterBlockEditorFromCanvasFrame();
		waitForCanvasEditReady();

		cy.getByAriaLabel('Open Navigation', { timeout: 20000 })
			.should('be.visible')
			.click();

		cy.url({ timeout: 20000 }).should('not.include', 'canvas=edit');

		enterBlockEditorFromCanvasFrame();
		waitForCanvasEditReady();
	});

	it('should rendered blockera canvas editor at the header top bar of Site Editor', () => {
		goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});

	it('should not show Blockera secondary sidebar on Site Editor main screen (canvas=view)', () => {
		goTo('/wp-admin/site-editor.php').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		// On main screen (no canvas=edit), secondary sidebar toggle and content must not be present.
		cy.get('.blockera-secondary-sidebar-toggle').should('not.exist');
		cy.get('.blockera-secondary-sidebar-content').should('not.exist');
	});

	it('should show Blockera secondary sidebar when Site Editor is in canvas=edit mode', () => {
		goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.get('.blockera-secondary-sidebar-toggle').should('exist');
	});

	/**
	 * Dispatch `primaryShift` + physical key (matches @wordpress/keycodes `isKeyboardEvent`).
	 * WordPress listens on `document` for `keydown` (see @wordpress/keyboard-shortcuts context).
	 */
	const pressPrimaryShiftKey = (win, key, code) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key,
				code,
				bubbles: true,
				cancelable: true,
				shiftKey: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	const sidebarShortcutEditorContexts = [
		{
			label: 'Site Editor',
			setup: () => {
				goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
					// eslint-disable-next-line
					cy.wait(2000);
				});
			},
		},
		{
			label: 'Post Editor',
			setup: () => {
				createPost();
			},
		},
	];

	sidebarShortcutEditorContexts.forEach(({ label, setup }) => {
		it(`should toggle primary, secondary, and both sidebars via keyboard shortcuts (${label})`, () => {
			setup();

			cy.getByDataTest('blockera-canvas-editor').should('exist');
			// Focus editor chrome (parent document) so shortcuts are not swallowed by iframe focus.
			cy.getByDataTest('blockera-canvas-editor').click({ force: true });

			cy.window().should((win) => {
				expect(win.wp?.data?.select('blockera/editor-persistence')).to
					.exist;
			});

			let primaryBefore;
			cy.window().then((win) => {
				primaryBefore = win.wp.data
					.select('blockera/editor-persistence')
					.isPrimarySidebarOpen();
			});

			// Primary sidebar: Cmd/Ctrl+Shift+. (Blockera swaps core binding off comma).
			cy.window().then((win) => pressPrimaryShiftKey(win, '.', 'Period'));
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isPrimarySidebarOpen()
				).to.eq(!primaryBefore);
			});

			cy.window().then((win) => pressPrimaryShiftKey(win, '.', 'Period'));
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isPrimarySidebarOpen()
				).to.eq(primaryBefore);
			});

			let secondaryBefore;
			cy.window().then((win) => {
				secondaryBefore = win.wp.data
					.select('blockera/editor-persistence')
					.isSecondarySidebarOpen();
			});

			// Secondary sidebar: Cmd/Ctrl+Shift+,
			cy.window().then((win) => pressPrimaryShiftKey(win, ',', 'Comma'));
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(!secondaryBefore);
			});

			cy.window().then((win) => pressPrimaryShiftKey(win, ',', 'Comma'));
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(secondaryBefore);
			});

			let bothClosedBefore;
			cy.window().then((win) => {
				bothClosedBefore = win.wp.data
					.select('blockera/editor-persistence')
					.areBothSidebarsClosed();
			});

			// Toggle both: Cmd/Ctrl+Shift+/
			cy.window().then((win) => pressPrimaryShiftKey(win, '/', 'Slash'));
			cy.window().should((win) => {
				const bothClosedAfter = win.wp.data
					.select('blockera/editor-persistence')
					.areBothSidebarsClosed();
				if (bothClosedBefore) {
					expect(bothClosedAfter).to.be.false;
				} else {
					expect(bothClosedAfter).to.be.true;
				}
			});

			cy.window().then((win) => {
				bothClosedBefore = win.wp.data
					.select('blockera/editor-persistence')
					.areBothSidebarsClosed();
			});

			cy.window().then((win) => pressPrimaryShiftKey(win, '/', 'Slash'));
			cy.window().should((win) => {
				const bothClosedAfter = win.wp.data
					.select('blockera/editor-persistence')
					.areBothSidebarsClosed();
				if (bothClosedBefore) {
					expect(bothClosedAfter).to.be.false;
				} else {
					expect(bothClosedAfter).to.be.true;
				}
			});
		});
	});

	it('should show Blockera secondary sidebar in Post Editor', () => {
		createPost();

		cy.get('.blockera-secondary-sidebar-toggle').should('exist');
	});

	it('should rendered the blockera breakpoints navbar at the top of the page while "Top toolbar" is enabled', () => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.get('[aria-label="Options"]').first().click();

		cy.get('button')
			.contains('Top toolbar')
			.then(($button) => {
				if ($button.attr('aria-checked') !== 'true') {
					$button.click();
				}
			});

		cy.getByAriaLabel('Desktop').should('be.visible');
		cy.getByAriaLabel('Hide block tools').click();
		cy.getByAriaLabel('Desktop').should('be.visible');

		cy.get('[aria-label="Options"]').eq(1).click();

		// We should disable top toolbar to ensure of rendering canvas editor at the header top bar for remaining other tests.
		cy.get('button')
			.contains('Top toolbar')
			.then(($button) => {
				$button.click();
			});
	});
});
