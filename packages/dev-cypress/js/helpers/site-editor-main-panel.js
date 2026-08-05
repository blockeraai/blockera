/**
 * Cypress helpers for Blockera One Site Editor main panel (view-mode chrome).
 */

import { closeWelcomeGuide } from './editor';
import { goTo } from './site-navigation';

export const SITE_EDITOR_TEST_IDS = {
	hub: 'blockera-site-editor-site-hub',
	hubDashboard: 'blockera-site-editor-site-hub-dashboard',
	hubTitle: 'blockera-site-editor-site-hub-title',
	hubCommand: 'blockera-site-editor-site-hub-command',
	header: 'blockera-site-editor-main-panel-header',
	headerTitle: 'blockera-site-editor-main-panel-header-title',
	headerMore: 'blockera-site-editor-main-panel-header-more',
	resetStyles: 'blockera-site-editor-reset-styles',
	nav: 'blockera-site-editor-main-navigation',
	navStyles: 'blockera-site-editor-nav-styles',
	navNavigation: 'blockera-site-editor-nav-navigation',
	navPages: 'blockera-site-editor-nav-pages',
	navTemplates: 'blockera-site-editor-nav-templates',
	navPatterns: 'blockera-site-editor-nav-patterns',
	navIdentity: 'blockera-site-editor-nav-identity',
	navHomepage: 'blockera-site-editor-nav-homepage',
	navPerformance: 'blockera-site-editor-nav-performance',
	navCommunity: 'blockera-site-editor-nav-community',
	navRoadmap: 'blockera-site-editor-nav-roadmap',
	navFeatureRequests: 'blockera-site-editor-nav-feature-requests',
	identityPanel: 'blockera-site-editor-identity-panel',
	identityTitle: 'blockera-site-editor-identity-title',
	identityTagline: 'blockera-site-editor-identity-tagline',
	identityLogoChoose: 'blockera-site-editor-identity-logo-choose',
	homepagePanel: 'blockera-site-editor-homepage-panel',
	homepagePosts: 'blockera-site-editor-homepage-posts',
	homepageStatic: 'blockera-site-editor-homepage-static',
	homepagePage: 'blockera-site-editor-homepage-page',
	homepagePostsPage: 'blockera-site-editor-homepage-posts-page',
	performancePanel: 'blockera-site-editor-performance-panel',
	performanceDisableEmojis: 'blockera-site-editor-performance-disable-emojis',
};

export const DISABLE_EMOJIS_SETTING = 'blockera_one_disable_emojis';

/**
 * Open Site Editor in view mode (sidebar chrome visible).
 * Unlike `openSiteEditor()`, this does not force `canvas=edit`.
 */
export function openSiteEditorViewMode(path = '/') {
	const encodedPath = encodeURIComponent(path);
	goTo(`/wp-admin/site-editor.php?p=${encodedPath}`).then(() => {
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);
		closeWelcomeGuide();
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.hub, { timeout: 60000 }).should(
			'be.visible'
		);
	});
}

export function getSiteEditorHub() {
	return cy.getByDataTest(SITE_EDITOR_TEST_IDS.hub);
}

export function getSiteEditorHeader() {
	return cy.getByDataTest(SITE_EDITOR_TEST_IDS.header);
}

export function getSiteEditorNav() {
	return cy.getByDataTest(SITE_EDITOR_TEST_IDS.nav);
}

export function clickSiteEditorNav(testId) {
	return cy.getByDataTest(testId).should('be.visible').click();
}

/**
 * Assert Blockera Site Editor chrome is mounted (hub + branding).
 */
export function assertSiteEditorChrome() {
	cy.get('body').should('have.class', 'has-blockera-site-editor-main-panel');
	getSiteEditorHub().should('be.visible');
	getSiteEditorHeader().should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.headerTitle).should(
		'contain.text',
		'Blockera One'
	);
	// Core hub stays in DOM but is CSS-hidden; Blockera hub is the visible one.
	cy.get('.edit-site-layout__sidebar > .edit-site-site-hub').should(
		'not.be.visible'
	);
}

/**
 * Assert Design-root nav categories are present.
 */
export function assertSiteEditorMainNav() {
	getSiteEditorNav().should('be.visible');
	[
		SITE_EDITOR_TEST_IDS.navStyles,
		SITE_EDITOR_TEST_IDS.navNavigation,
		SITE_EDITOR_TEST_IDS.navPages,
		SITE_EDITOR_TEST_IDS.navTemplates,
		SITE_EDITOR_TEST_IDS.navPatterns,
		SITE_EDITOR_TEST_IDS.navIdentity,
		SITE_EDITOR_TEST_IDS.navHomepage,
		SITE_EDITOR_TEST_IDS.navPerformance,
		SITE_EDITOR_TEST_IDS.navCommunity,
		SITE_EDITOR_TEST_IDS.navRoadmap,
		SITE_EDITOR_TEST_IDS.navFeatureRequests,
	].forEach((id) => {
		cy.getByDataTest(id).should('exist');
	});
}

/**
 * Read `root/site` edited entity from the editor data store.
 *
 * @param {(site: Object) => void} assertFn Assertion callback.
 */
export function assertEditedSiteRecord(assertFn) {
	cy.window().then((win) => {
		const site = win.wp.data
			.select('core')
			.getEditedEntityRecord('root', 'site');
		assertFn(site || {});
	});
}

/**
 * Persist dirty `root/site` edits (Save Hub equivalent for site settings).
 * Note: `saveSiteEditorDirtyEntities` intentionally skips `root/site`.
 *
 * @return {Cypress.Chainable}
 */
export function saveEditedSiteRecord() {
	return cy.window().then((win) => {
		return win.wp.data
			.dispatch('core')
			.saveEditedEntityRecord('root', 'site');
	});
}

/**
 * Update a Site Editor settings field via authenticated REST `/wp/v2/settings`.
 *
 * @param {Object} body Settings payload.
 * @return {Cypress.Chainable}
 */
export function updateSiteSettingsViaRest(body) {
	const testURL = (Cypress.env('testURL') || '').replace(/\/$/, '');
	// wp-env may not expose pretty `/wp-json` routes to the host; use rest_route.
	const url = `${testURL}/?rest_route=/wp/v2/settings`;

	return cy.window().then((win) => {
		const nonce = win.wpApiSettings?.nonce;
		expect(nonce, 'wpApiSettings.nonce').to.be.a('string').and.not.be.empty;

		return cy.request({
			method: 'POST',
			url,
			headers: {
				'X-WP-Nonce': nonce,
			},
			body,
		});
	});
}

/**
 * Toggle the Disable Emojis Script control in the Performance panel.
 *
 * @param {boolean} enabled Desired checked state.
 */
export function setDisableEmojisToggle(enabled) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.performanceDisableEmojis)
		.find('.components-form-toggle input[type="checkbox"]')
		.then(($input) => {
			const isChecked = $input.prop('checked');
			if (isChecked !== enabled) {
				cy.wrap($input).click({ force: true });
			}
		});
}

/**
 * Assert WP emoji detection script / styles on the front end.
 *
 * @param {{ present: boolean }} options
 */
export function assertFrontEndEmojiAssets({ present }) {
	const testURL = Cypress.env('testURL') || '';
	const frontUrl = testURL.replace(/\/$/, '') + '/';

	cy.visit(frontUrl, { failOnStatusCode: false });

	cy.document().then((doc) => {
		const html = doc.documentElement ? doc.documentElement.innerHTML : '';
		const hasAssets =
			html.includes('wp-emoji-release') ||
			html.includes('wp-emoji-loader') ||
			html.includes('wp-emoji-styles') ||
			html.includes('wp-emoji-settings') ||
			!!doc.querySelector(
				'script[src*="wp-emoji"], #wp-emoji-styles-inline-css, #wp-emoji-styles-css'
			);

		expect(
			hasAssets,
			present
				? 'expected WP emoji assets on the front end'
				: 'expected WP emoji assets to be removed from the front end'
		).to.equal(present);
	});
}
