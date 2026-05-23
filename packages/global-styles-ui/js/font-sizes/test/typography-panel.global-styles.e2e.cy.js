/**
 * External dependencies
 */
import {
	openGlobalStylesTypographyFlow,
	TYPOGRAPHY_OVERRIDE_CLASS,
} from '@blockera/dev-cypress/js/helpers';

const FONT_SIZE_INSPECTOR_ACTIVE_CLASS =
	'blockera-font-size-preset-inspector-active';

const NAVIGATOR_SCREEN_SELECTOR =
	'.edit-site-global-styles-sidebar__navigator-screen, .global-styles-ui-sidebar__navigator-screen';

function openFontSizeVariablesScreen() {
	openGlobalStylesTypographyFlow();

	cy.contains(
		'.blockera-font-size-presets-count button',
		'Font size variables'
	)
		.should('be.visible')
		.click({ force: true });

	cy.get('.blockera-font-size-presets', { timeout: 15000 }).should(
		'be.visible'
	);
}

describe('Global Styles → Typography panel (DOM + observer)', () => {
	it('adds typography override class and mounts font sizes entry after typography handler runs', () => {
		openGlobalStylesTypographyFlow();

		cy.get('button[id="/typography"]').should('exist');

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);
	});

	it('does not mount duplicate font size preset rows while the list screen is present', () => {
		openGlobalStylesTypographyFlow();

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(400);

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);
	});

	it('hides native WordPress font size presets entry while Blockera override is active', () => {
		openGlobalStylesTypographyFlow();

		cy.contains('button', 'Font size variables').should('be.visible');
		cy.contains('button', 'Font size presets').should('not.exist');
	});

	it('applies cleanup + inspector-active DOM when opening font size variables', () => {
		openGlobalStylesTypographyFlow();

		cy.get('body').should(
			'not.have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.contains(
			'.blockera-font-size-presets-count button',
			'Font size variables'
		).click({ force: true });

		cy.get('.blockera-font-size-presets').should('be.visible');

		cy.get('body').should('have.class', 'blockera-cleanup-screen-styles');

		cy.get(`.${FONT_SIZE_INSPECTOR_ACTIVE_CLASS}`).should('exist');
	});

	it('keeps the typography override body class while on the font size variables screen', () => {
		openFontSizeVariablesScreen();

		cy.get('body').should('have.class', TYPOGRAPHY_OVERRIDE_CLASS);
	});

	it('shows the font size variables shell with header copy after navigation', () => {
		openFontSizeVariablesScreen();

		cy.get('.blockera-font-size-presets')
			.contains('Font Size Variables')
			.should('be.visible');

		cy.get('.blockera-font-size-presets')
			.contains(
				'Create and edit font size variables used for typography across the site.'
			)
			.should('be.visible');
	});

	it('renders at least one font size preset row on the variables screen', () => {
		openFontSizeVariablesScreen();

		cy.getByDataCy('font-size-repeater-item-header')
			.its('length')
			.should('be.gte', 1);
	});

	it('does not zero out Blockera Spacer padding on the font size variables screen', () => {
		openFontSizeVariablesScreen();

		cy.get('body').should('have.class', 'blockera-cleanup-screen-styles');

		cy.get('.blockera-font-size-presets .components-spacer').should(
			($spacer) => {
				const paddingLeft = parseFloat($spacer.css('padding-left'));
				expect(paddingLeft).to.be.greaterThan(0);
			}
		);
	});

	it('hides native WordPress font size presets editor while on the variables screen', () => {
		openFontSizeVariablesScreen();

		cy.get(NAVIGATOR_SCREEN_SELECTOR).within(() => {
			cy.contains('Font size presets').should('not.be.visible');
		});

		cy.get('.blockera-font-size-presets').should('be.visible');
	});

	it('navigates to heading element screen and returns to typography list', () => {
		openGlobalStylesTypographyFlow();

		cy.get(`.${FONT_SIZE_INSPECTOR_ACTIVE_CLASS}`).should('not.exist');

		cy.get('button[id="/typography/heading"]').click({ force: true });
		cy.get('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.click({ force: true });

		cy.get('.blockera-font-size-presets-count').should('exist');
	});

	it('ScreenHeader back runs onBack (clears cleanup + inspector-active, returns to list)', () => {
		openGlobalStylesTypographyFlow();

		cy.get(`.${FONT_SIZE_INSPECTOR_ACTIVE_CLASS}`).should('not.exist');

		cy.contains(
			'.blockera-font-size-presets-count button',
			'Font size variables'
		)
			.should('be.visible')
			.click({ force: true });

		cy.get('.blockera-font-size-presets', { timeout: 10000 }).should(
			'be.visible'
		);
		cy.get('body', { timeout: 4000 }).should(
			'have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.get('.blockera-font-size-presets')
			.find('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.should('exist')
			.click({ force: true });

		cy.get('body', { timeout: 4000 }).should(
			'not.have.class',
			'blockera-cleanup-screen-styles'
		);

		cy.get(`.${FONT_SIZE_INSPECTOR_ACTIVE_CLASS}`, {
			timeout: 4000,
		}).should('not.exist');

		cy.contains(
			'.blockera-font-size-presets-count',
			'Font size variables',
			{ timeout: 4000 }
		).should('exist');
	});

	it('removes typography override class when the useOverrideNavigator target back button is clicked', () => {
		openGlobalStylesTypographyFlow();

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

		cy.get('body').should('not.have.class', TYPOGRAPHY_OVERRIDE_CLASS);
	});
});
