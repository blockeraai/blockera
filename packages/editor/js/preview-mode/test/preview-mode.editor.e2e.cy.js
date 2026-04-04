/**
 * End-to-end tests for Blockera preview mode (in-editor frontend preview overlay).
 *
 * ## Features & scenarios covered
 *
 * - **Header toggle**: “Live frontend preview” control is present and opens the overlay when the
 *   post is saveable and viewable.
 * - **Overlay shell**: Dialog, `blockera-preview-mode-open` on `body`, preview iframe with
 *   `blockera-hide-admin-bar` (matches {@link HIDE_ADMIN_BAR_ARG}).
 * - **Close paths**: Close button, Escape.
 * - **Keyboard**: Primary+P toggles overlay (matches registered shortcut).
 * - **New tab**: Primary+Shift+P, Cmd/Ctrl+click on toggle, and overlay “open in new tab” call
 *   `window.open` (stubbed).
 *
 * Selectors: `test-id` values from `packages/editor/js/preview-mode/constants/testIds.ts`
 * (Cypress: `cy.getByTestId`, `cy.previewStubWindowOpen`, `cy.previewClickToggle`,
 * `cy.previewExpectOverlayOpen`, `cy.previewExpectOverlayClosed`).
 *
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';
import { PREVIEW_MODE_TEST_ID } from 'blockera-editor-preview-test-ids';

describe('Blockera preview mode', () => {
	/**
	 * The preview control stays disabled until the document is saveable (core rules).
	 * Set a title so the toggle becomes clickable like a real editing session.
	 */
	const setPostTitleInCanvas = (text) => {
		cy.getIframeBody()
			.find('.edit-post-visual-editor__post-title-wrapper')
			.should('be.visible')
			.first()
			.within(() => {
				cy.get(
					'[contenteditable="true"], textarea.editor-post-title__input, .editor-post-title__input'
				)
					.first()
					.should('be.visible')
					.click({ force: true })
					.type('{selectall}{backspace}' + text, {
						delay: 0,
					});
			});
	};

	beforeEach(() => {
		createPost();
		setPostTitleInCanvas(`Preview e2e ${Date.now()}`);
		cy.getByTestId(PREVIEW_MODE_TEST_ID.toggleButton, { timeout: 60000 })
			.should('be.visible')
			.should('not.have.attr', 'aria-disabled', 'true');
	});

	/**
	 * Matches @wordpress/keycodes `primary` + physical key (toggle preview).
	 */
	const dispatchPrimaryKeyP = (win) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: 'p',
				code: 'KeyP',
				bubbles: true,
				cancelable: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	/**
	 * Matches `primaryShift` + P (open preview in new tab).
	 */
	const dispatchPrimaryShiftKeyP = (win) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: 'p',
				code: 'KeyP',
				bubbles: true,
				cancelable: true,
				shiftKey: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	const dispatchEscape = (win) => {
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: 'Escape',
				code: 'Escape',
				bubbles: true,
				cancelable: true,
			})
		);
	};

	it('should show the header preview toggle enabled for a new post', () => {
		cy.getByTestId(PREVIEW_MODE_TEST_ID.toggleButton, { timeout: 30000 })
			.should('be.visible')
			.should('not.have.attr', 'aria-disabled', 'true');
	});

	it('should open the preview overlay on toggle click and load iframe with admin bar hidden', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();
		cy.getByTestId(PREVIEW_MODE_TEST_ID.iframe)
			.should('have.attr', 'src')
			.and('include', 'blockera-hide-admin-bar');
	});

	it('should close the overlay when clicking the header close control', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();
		cy.getByTestId(PREVIEW_MODE_TEST_ID.close).should('be.visible').click();
		cy.previewExpectOverlayClosed();
	});

	it('should close the overlay when pressing Escape', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();
		cy.window().then((win) => dispatchEscape(win));
		cy.previewExpectOverlayClosed();
	});

	it('should toggle the overlay with the primary+P keyboard shortcut', () => {
		cy.window().then((win) => dispatchPrimaryKeyP(win));
		cy.previewExpectOverlayOpen();
		cy.window().then((win) => dispatchPrimaryKeyP(win));
		cy.previewExpectOverlayClosed();
	});

	it('should call window.open when using primary+shift+P', () => {
		cy.previewStubWindowOpen();
		cy.window().then((win) => dispatchPrimaryShiftKeyP(win));
		cy.get('@previewWindowOpen').should('have.been.called');
		cy.previewExpectOverlayClosed();
	});

	it('should call window.open when clicking the toggle with primary modifier', () => {
		const isMac = Cypress.platform === 'darwin';
		cy.previewStubWindowOpen();
		cy.getByTestId(PREVIEW_MODE_TEST_ID.toggleButton).click({
			metaKey: isMac,
			ctrlKey: !isMac,
		});
		cy.get('@previewWindowOpen').should('have.been.called');
		cy.previewExpectOverlayClosed();
	});

	it('should call window.open from the overlay “open in new tab” control', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();
		cy.previewStubWindowOpen();
		cy.getByTestId(PREVIEW_MODE_TEST_ID.openInNewTab).click();
		cy.get('@previewWindowOpen').should('have.been.called');
	});

	it('should keep the overlay open after reload and still show the iframe', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();
		cy.getByTestId(PREVIEW_MODE_TEST_ID.reload)
			.should('be.visible')
			.click();
		cy.previewExpectOverlayOpen();
	});

	it('should update preview breakpoint container when editor breakpoint changes', () => {
		cy.previewClickToggle();
		cy.previewExpectOverlayOpen();

		// Desktop/base first (expected default for new editor session).
		cy.get('.blockera-preview-overlay__iframe-container')
			.should('have.class', 'breakpoint-desktop')
			.then(($el) => {
				const desktopWidth = $el[0].getBoundingClientRect().width;
				expect(desktopWidth).to.be.greaterThan(0);

				// Click any available *non-desktop* breakpoint icon in the header (picked breakpoints).
				// We intentionally avoid hardcoding labels because sites can customize breakpoint names.
				cy.getByAriaLabel('Breakpoints', { timeout: 30000 })
					.first()
					.children('[aria-label]')
					.then(($icons) => {
						const nonDesktop = Array.from($icons).find(
							(el) => el.getAttribute('aria-label') !== 'Desktop'
						);
						expect(nonDesktop, 'non-desktop breakpoint icon').to
							.exist;
						cy.wrap(nonDesktop).click({ force: true });
					});

				// Preview overlay should react: container class changes.
				// Width usually becomes narrower, but some breakpoint configs may match the desktop width,
				// so only require "not wider".
				cy.get('.blockera-preview-overlay__iframe-container', {
					timeout: 30000,
				})
					.should('not.have.class', 'breakpoint-desktop')
					.then(($bp) => {
						const bpWidth = $bp[0].getBoundingClientRect().width;
						expect(bpWidth).to.be.greaterThan(0);
						expect(bpWidth).to.be.at.most(desktopWidth);
					});
			});
	});
});
