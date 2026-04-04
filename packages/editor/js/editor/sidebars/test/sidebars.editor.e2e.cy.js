/**
 * Blockera dependencies
 */
import {
	createPost,
	goTo,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

describe('Blockera sidebars (primary + secondary)', () => {
	/**
	 * Ensures Blockera editor persistence store is available (for assertions).
	 */
	const expectSidebarsStore = () => {
		cy.window().should((win) => {
			expect(win.wp?.data?.select('blockera/editor-persistence')).to
				.exist;
		});
	};

	/**
	 * Focus editor chrome (parent document) so keyboard shortcuts aren’t swallowed by iframe focus.
	 */
	const focusEditorChrome = () => {
		cy.get('body').then(($body) => {
			// Prefer Blockera chrome when present (Post Editor, Site Editor canvas=edit).
			if ($body.find('[data-test="blockera-canvas-editor"]').length > 0) {
				return cy
					.getByDataTest('blockera-canvas-editor')
					.should('exist')
					.click({ force: true });
			}

			// Site Editor canvas=view: fall back to a safe click in top document.
			return cy.get('body').click(0, 0, { force: true });
		});
	};

	/**
	 * Ensure both sidebars are closed using the dedicated shortcut (Cmd/Ctrl+Shift+/).
	 * Uses `areBothSidebarsClosed()` to avoid relying on unknown initial state/persistence.
	 */
	const ensureBothClosed = () => {
		cy.window().then((win) => {
			const sel = win.wp.data.select('blockera/editor-persistence');
			if (!sel.areBothSidebarsClosed()) {
				// Close both (if either/both open) via toggle-both behavior.
				cy.pressPrimaryShiftKey('/', 'Slash');
			}
		});

		cy.window().should((win) => {
			expect(
				win.wp.data
					.select('blockera/editor-persistence')
					.areBothSidebarsClosed()
			).to.eq(true);
		});
	};

	describe('Post Editor', () => {
		it('should toggle the secondary sidebar via the header toggle button and expose its resize handle', () => {
			createPost();
			closeWelcomeGuide();
			expectSidebarsStore();

			// Secondary toggle is Blockera-owned; use stable data-test.
			cy.getByDataTest('blockera-secondary-sidebar-toggle')
				.should('exist')
				.and('have.attr', 'aria-label');

			ensureBothClosed();

			// Open secondary via button.
			cy.getByDataTest('blockera-secondary-sidebar-toggle').click({
				force: true,
			});

			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(true);
			});

			cy.getByDataTest('blockera-secondary-sidebar-content')
				.should('exist')
				.and('have.class', 'is-visible');

			// Resize handle is portal-rendered inside the sidebar container.
			cy.getByDataTest('blockera-sidebar-resize-handle--right')
				.should('exist')
				.and('have.attr', 'aria-label');

			// Close secondary via button, verify close animation -> DOM removal.
			cy.getByDataTest('blockera-secondary-sidebar-toggle').click({
				force: true,
			});

			cy.getByDataTest('blockera-secondary-sidebar-content')
				.should('exist')
				.and('have.class', 'is-hidden');

			cy.wait(450);
			cy.getByDataTest('blockera-secondary-sidebar-content').should(
				'not.exist'
			);
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(false);
			});
		});

		it('should toggle primary, secondary, and both sidebars via keyboard shortcuts and keep actions scoped correctly', () => {
			createPost();
			closeWelcomeGuide();
			expectSidebarsStore();
			focusEditorChrome();

			ensureBothClosed();

			// Secondary: Cmd/Ctrl+Shift+,
			cy.pressPrimaryShiftKey(',', 'Comma');
			cy.window().should((win) => {
				const sel = win.wp.data.select('blockera/editor-persistence');
				expect(sel.isSecondarySidebarOpen()).to.eq(true);
				// Primary should remain closed when toggling secondary directly.
				expect(sel.isPrimarySidebarOpen()).to.eq(false);
			});

			// Primary: Cmd/Ctrl+Shift+. (Blockera swaps core binding off comma).
			cy.pressPrimaryShiftKey('.', 'Period');
			cy.window().should((win) => {
				const sel = win.wp.data.select('blockera/editor-persistence');
				expect(sel.isPrimarySidebarOpen()).to.eq(true);
				// Secondary stays open.
				expect(sel.isSecondarySidebarOpen()).to.eq(true);
			});

			// Toggle both: Cmd/Ctrl+Shift+/ should close both when either/both open.
			cy.pressPrimaryShiftKey('/', 'Slash');
			cy.window().should((win) => {
				const sel = win.wp.data.select('blockera/editor-persistence');
				expect(sel.areBothSidebarsClosed()).to.eq(true);
			});

			// Toggle both again: should open both when both are closed.
			cy.pressPrimaryShiftKey('/', 'Slash');
			cy.window().should((win) => {
				const sel = win.wp.data.select('blockera/editor-persistence');
				expect(sel.areBothSidebarsClosed()).to.eq(false);
				expect(sel.isSecondarySidebarOpen()).to.eq(true);
				expect(sel.isPrimarySidebarOpen()).to.eq(true);
			});

			// Close both again to leave editor clean.
			ensureBothClosed();
		});

		it('should show a primary sidebar resize handle only when the primary sidebar is open', () => {
			createPost();
			closeWelcomeGuide();
			expectSidebarsStore();
			focusEditorChrome();

			ensureBothClosed();

			// Open primary via shortcut (stable, locale-safe).
			cy.pressPrimaryShiftKey('.', 'Period');
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isPrimarySidebarOpen()
				).to.eq(true);
			});

			cy.getByDataTest('blockera-sidebar-resize-handle--left').should(
				'exist'
			);

			// Close primary via shortcut.
			cy.pressPrimaryShiftKey('.', 'Period');
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isPrimarySidebarOpen()
				).to.eq(false);
			});

			cy.getByDataTest('blockera-sidebar-resize-handle--left').should(
				'not.exist'
			);
		});
	});

	describe('Site Editor', () => {
		it('should not render the secondary sidebar controls in canvas=view and should not respond to the secondary shortcut there', () => {
			goTo('/wp-admin/site-editor.php').then(() => {
				cy.wait(2000);
			});
			closeWelcomeGuide();
			expectSidebarsStore();

			cy.getByDataTest('blockera-secondary-sidebar-toggle').should(
				'not.exist'
			);
			cy.getByDataTest('blockera-secondary-sidebar-content').should(
				'not.exist'
			);

			// The shortcut is registered only when the secondary sidebar injector is mounted.
			focusEditorChrome();

			cy.window().then((win) => {
				// Force a known closed baseline first (if persisted open, close it).
				const sel = win.wp.data.select('blockera/editor-persistence');
				if (sel.isSecondarySidebarOpen()) {
					// In canvas=view, toggle-both shortcut is registered by primary controller; use it to close both.
					cy.pressPrimaryShiftKey('/', 'Slash');
				}
			});

			cy.window().then((win) => {
				const before = win.wp.data
					.select('blockera/editor-persistence')
					.isSecondarySidebarOpen();
				cy.wrap(before).as('secondaryBefore');
			});

			cy.pressPrimaryShiftKey(',', 'Comma');

			cy.get('@secondaryBefore').then((before) => {
				cy.window().should((win) => {
					expect(
						win.wp.data
							.select('blockera/editor-persistence')
							.isSecondarySidebarOpen()
					).to.eq(before);
				});
			});
		});

		it('should render the secondary sidebar controls in canvas=edit and respond to the shortcut', () => {
			goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
				cy.wait(2000);
			});
			closeWelcomeGuide();
			expectSidebarsStore();

			cy.getByDataTest('blockera-secondary-sidebar-toggle').should(
				'exist'
			);

			focusEditorChrome();
			ensureBothClosed();

			cy.pressPrimaryShiftKey(',', 'Comma');
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(true);
			});

			cy.getByDataTest('blockera-secondary-sidebar-content').should(
				'exist'
			);

			// Close again.
			cy.pressPrimaryShiftKey(',', 'Comma');
			cy.window().should((win) => {
				expect(
					win.wp.data
						.select('blockera/editor-persistence')
						.isSecondarySidebarOpen()
				).to.eq(false);
			});
		});
	});
});
