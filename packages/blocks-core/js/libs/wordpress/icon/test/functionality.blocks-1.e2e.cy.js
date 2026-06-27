/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('core/icon Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Blockera extension, icon panel, and frontend SVG output', () => {
		appendBlocks(`<!-- wp:icon {"icon":"core/image"} /-->`);

		cy.getBlock('core/icon').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.getByAriaControls('settings-view').click();

		cy.get('.blockera-extension-icon').should('be.visible');

		cy.get('.blockera-extension-icon').click();

		cy.get('.blockera-component-modal.blockera-control-icon-picker-modal')
			.should('be.visible')
			.within(() => {
				cy.get('button[aria-label="Close"]').click();
			});

		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-icon svg').should('exist');
	});

	it('block toolbar opens Blockera icon picker and updates canvas', () => {
		appendBlocks(`<!-- wp:icon /-->`);

		cy.getBlock('core/icon').first().click();

		cy.get('.block-editor-block-toolbar')
			.contains('button', 'Choose icon')
			.click();

		cy.get('.blockera-control-icon-picker-modal').should('be.visible');

		cy.get('.blockera-control-icon-control-icon')
			.not('.blockera-is-pro-icon')
			.first()
			.click();

		cy.get('.blockera-control-icon-picker-modal').should('not.exist');

		cy.getBlock('core/icon').within(() => {
			cy.get('svg').should('exist');
		});

		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-icon svg').should('exist');
	});

	it('renders persisted pro library icon in editor and on frontend (free Blockera)', () => {
		appendBlocks(
			`<!-- wp:icon {"blockeraPropsId":"527162621310","blockeraCompatId":"527162621310","blockeraIcon":{"value":{"icon":"chrome","library":"feather","uploadSVG":"","renderedIcon":"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItY2hyb21lIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIj48L2NpcmNsZT48bGluZSB4MT0iMjEuMTciIHkxPSI4IiB4Mj0iMTIiIHkyPSI4IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciI+PC9saW5lPjxsaW5lIHgxPSIzLjk1IiB5MT0iNi4wNiIgeDI9IjguNTQiIHkyPSIxNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiPjwvbGluZT48bGluZSB4MT0iMTAuODgiIHkxPSIyMS45NCIgeDI9IjE1LjQ2IiB5Mj0iMTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIj48L2xpbmU+PC9zdmc+","svgString":""}},"className":"blockera-block blockera-block-ub774g wp-block-icon-blockera"} /-->`
		);

		cy.getBlock('core/icon').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.getByAriaControls('settings-view').click();

		cy.getBlock('core/icon').within(() => {
			cy.get('svg').should('exist');
		});

		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-icon svg').should('exist');
	});
});
