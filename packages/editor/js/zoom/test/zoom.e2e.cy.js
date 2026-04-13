/**
 * Blockera editor zoom — Cypress e2e.
 *
 * Scenarios covered:
 * - Header control renders and shows default 100% (storage cleared on load).
 * - Dropdown: zoom in (+10%), zoom out (−10%), zoom to 50%, zoom to 100%.
 * - Dropdown: zoom to fit updates level (with content in the canvas).
 * - Zoom level field: set explicit percentage (e.g. 75%).
 * - Canvas iframe gets `is-zoomed-out` when zoom ≠ 100%.
 * - Keyboard (parent window): primary+0 reset, primary+= zoom in, primaryShift+1 zoom to fit.
 * - In-canvas header: “Reset Zoom” returns to 100%.
 * - Persisted zoom in localStorage survives reload.
 *
 * Selectors: `data-test` on zoom UI (`blockera-zoom-control`, menu items, level input, iframe reset).
 *
 * Blockera dependencies
 */
import {
	appendBlocks,
	closeWelcomeGuide,
	createPostClearingZoomStorage,
	disableGutenbergFeatures,
} from '@blockera/dev-cypress/js/helpers';

describe('Blockera editor zoom', () => {
	const pressPrimaryDigit0 = (win) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: '0',
				code: 'Digit0',
				bubbles: true,
				cancelable: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	const pressPrimaryEqual = (win) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: '=',
				code: 'Equal',
				bubbles: true,
				cancelable: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	const pressPrimaryShiftDigit1 = (win) => {
		const isMac = Cypress.platform === 'darwin';
		win.document.dispatchEvent(
			new win.KeyboardEvent('keydown', {
				key: '1',
				code: 'Digit1',
				bubbles: true,
				cancelable: true,
				shiftKey: true,
				metaKey: isMac,
				ctrlKey: !isMac,
			})
		);
	};

	it('should show zoom control at 100% when storage is cleared on load', () => {
		createPostClearingZoomStorage();

		cy.getByDataTest('blockera-zoom-control', { timeout: 30000 })
			.should('be.visible')
			.and('contain', '100%');
	});

	it('should zoom in and out from the dropdown menu', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-in').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '110%');

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-out').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '100%');
	});

	it('should apply zoom to 50% and reset to 100% from the menu', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-to-50').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '50%');

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-to-100').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '100%');
	});

	it('should set zoom via the level input', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-level-input')
			.find('input')
			.first()
			.then(($input) => {
				const el = $input[0];
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					'value'
				)?.set;
				nativeInputValueSetter?.call(el, '75');
				el.dispatchEvent(new Event('input', { bubbles: true }));
				el.dispatchEvent(new Event('change', { bubbles: true }));
			});
		cy.get('body').type('{esc}', { force: true });
		cy.getByDataTest('blockera-zoom-control').should('contain', '75%');
	});

	it('should add is-zoomed-out to the canvas iframe when zoom is not 100%', () => {
		createPostClearingZoomStorage();

		cy.get('iframe[name="editor-canvas"]').should(
			'not.have.class',
			'is-zoomed-out'
		);

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-to-50').click();

		cy.get('iframe[name="editor-canvas"]', { timeout: 20000 }).should(
			'have.class',
			'is-zoomed-out'
		);
	});

	it('should reset zoom with primary+0 from the parent window', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-in').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '110%');

		cy.getByDataTest('blockera-zoom-control').click({ force: true });
		cy.window().then((win) => pressPrimaryDigit0(win));

		cy.getByDataTest('blockera-zoom-control').should('contain', '100%');
	});

	it('should zoom in with primary+= from the parent window', () => {
		createPostClearingZoomStorage();

		cy.getByDataTest('blockera-zoom-control').click({ force: true });
		cy.window().then((win) => pressPrimaryEqual(win));

		cy.getByDataTest('blockera-zoom-control').should('contain', '110%');
	});

	it('should run zoom to fit with primaryShift+1 when the canvas has content', () => {
		createPostClearingZoomStorage();

		appendBlocks(
			'<!-- wp:paragraph -->\n<p>Zoom fit content</p>\n<!-- /wp:paragraph -->'
		);

		cy.getByDataTest('blockera-zoom-control').click({ force: true });
		cy.window().then((win) => pressPrimaryShiftDigit1(win));

		cy.getByDataTest('blockera-zoom-control').should(($el) => {
			const text = $el.text();
			expect(text).to.match(/\d+%/);
			expect(text).not.to.include('100%');
		});
	});

	it('should reset zoom from the in-canvas header at 50%', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-to-50').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '50%');

		cy.getIframeBody()
			.find('[data-test="blockera-zoom-header-reset"]', {
				timeout: 20000,
			})
			.should('be.visible')
			.click({ force: true });

		cy.getByDataTest('blockera-zoom-control').should('contain', '100%');
	});

	it('should persist zoom in localStorage across reload', () => {
		createPostClearingZoomStorage();

		cy.zoomOpenDropdown();
		cy.getByDataTest('blockera-zoom-menu-zoom-to-50').click();
		cy.getByDataTest('blockera-zoom-control').should('contain', '50%');

		cy.reload();
		// eslint-disable-next-line
		cy.wait(2000);
		closeWelcomeGuide();
		disableGutenbergFeatures();

		cy.getByDataTest('blockera-zoom-control', { timeout: 30000 }).should(
			'contain',
			'50%'
		);
	});
});
