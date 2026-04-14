/**
 * External dependencies
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

const COLORS_OVERRIDE_CLASS = 'is-open-blockera-colors-navigation-override';

function openGlobalStylesColorsFlow() {
	openSiteEditor();

	cy.openGlobalStylesPanel();

	closeWelcomeGuide();

	cy.get('button[id="/colors"]').eq(1).should('exist').click({ force: true });

	cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);

	cy.get('.edit-site-global-styles-sidebar__navigator-screen', {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-colors-presets-count').should('exist');
}

describe('Global Styles → Colors panel (DOM + observer)', () => {
	it('adds colors override class and mounts the Blockera colors list after the colors handler runs', () => {
		openGlobalStylesColorsFlow();

		cy.get('button[id="/colors"]').should('exist');

		cy.get('.blockera-colors-presets-count').should('have.length', 1);
	});

	it('does not mount duplicate colors list roots while the list screen is present', () => {
		openGlobalStylesColorsFlow();

		cy.get('.blockera-colors-presets-count').should('have.length', 1);

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(400);

		cy.get('.blockera-colors-presets-count').should('have.length', 1);
	});

	it('keeps the colors override body class while on a nested Blockera colors screen', () => {
		openGlobalStylesColorsFlow();

		cy.contains('.blockera-colors-presets-count button', 'Color variables')
			.should('exist')
			.click({ force: true });

		cy.get('.blockera-color-palette-presets', { timeout: 15000 }).should(
			'be.visible'
		);

		cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);
	});

	it('applies cleanup + inspector-active DOM when opening color variables (override UI)', () => {
		openGlobalStylesColorsFlow();

		cy.get('body').should(
			'not.have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.contains(
			'.blockera-colors-presets-count button',
			'Color variables'
		).click({ force: true });

		cy.get('.blockera-color-palette-presets').should('be.visible');

		cy.get('body').should('have.class', 'blockera-cleanup-screen-styles');

		cy.get('.blockera-colors-preset-inspector-active').should('exist');
	});

	it('shows the color palette shell with header copy after navigation', () => {
		openGlobalStylesColorsFlow();

		cy.contains(
			'.blockera-colors-presets-count button',
			'Color variables'
		).click({ force: true });

		cy.get('.blockera-color-palette-presets')
			.contains('Color Variables')
			.should('be.visible');

		cy.get('.blockera-color-palette-presets')
			.contains(
				'Create and edit color variables used for text, backgrounds, and borders.'
			)
			.should('be.visible');
	});

	it('renders at least one color preset row on the palette screen', () => {
		openGlobalStylesColorsFlow();

		cy.contains(
			'.blockera-colors-presets-count button',
			'Color variables'
		).click({ force: true });

		cy.getByDataCy('color-repeater-item-header')
			.its('length')
			.should('be.gte', 1);
	});

	it('ScreenHeader back runs onBack (clears cleanup + inspector-active, returns to list)', () => {
		openGlobalStylesColorsFlow();

		// Click Color variables and wait until the palette is visible and body class is updated
		cy.contains('.blockera-colors-presets-count button', 'Color variables')
			.should('be.visible')
			.click({ force: true });

		cy.get('.blockera-color-palette-presets', { timeout: 10000 }).should(
			'be.visible'
		);
		cy.get('body', { timeout: 4000 }).should(
			'have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.get('.blockera-color-palette-presets')
			.find('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.should('exist')
			.click({ force: true });

		cy.get('body', { timeout: 4000 }).should(
			'not.have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.get('.blockera-colors-preset-inspector-active', {
			timeout: 4000,
		}).should('not.exist');

		cy.contains('.blockera-colors-presets-count', 'Color variables', {
			timeout: 4000,
		}).should('exist');
	});

	it('opens linear gradient variables and returns with ScreenHeader back', () => {
		openGlobalStylesColorsFlow();

		cy.contains(
			'.blockera-colors-presets-count button',
			'Linear gradient variables'
		)
			.should('be.visible')
			.click({ force: true });

		cy.get('.blockera-linear-gradients-presets', { timeout: 15000 }).should(
			'be.visible'
		);

		cy.get('.blockera-linear-gradients-presets')
			.contains('Linear Gradient Variables')
			.should('be.visible');

		cy.get('.blockera-linear-gradients-presets')
			.find('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.should('exist')
			.click({ force: true });

		cy.contains(
			'.blockera-colors-presets-count',
			'Linear gradient variables',
			{ timeout: 4000 }
		).should('exist');
	});

	it('opens radial gradient variables and returns with ScreenHeader back', () => {
		openGlobalStylesColorsFlow();

		cy.contains(
			'.blockera-colors-presets-count button',
			'Radial gradient variables'
		)
			.should('be.visible')
			.click({ force: true });

		cy.get('.blockera-radial-gradients-presets', { timeout: 15000 }).should(
			'be.visible'
		);

		cy.get('.blockera-radial-gradients-presets')
			.contains('Radial Gradient Variables')
			.should('be.visible');

		cy.get('.blockera-radial-gradients-presets')
			.find('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.should('exist')
			.click({ force: true });

		cy.contains(
			'.blockera-colors-presets-count',
			'Radial gradient variables',
			{ timeout: 4000 }
		).should('exist');
	});

	it('removes colors override class when the useOverrideNavigator back target is clicked', () => {
		openGlobalStylesColorsFlow();

		cy.window().then((win) => {
			const btn = win.document.querySelector(
				'button[data-wp-component="Navigator.BackButton"]:first-child'
			);
			expect(
				btn,
				'matches useOverrideNavigator querySelector target'
			).to.be.instanceOf(win.HTMLButtonElement);
			btn.click();
		});

		cy.get('body').should('not.have.class', COLORS_OVERRIDE_CLASS);
	});
});
