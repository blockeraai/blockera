/**
 * Cypress helpers for Blockera One Site Editor main panel (view-mode chrome).
 */

import { closeWelcomeGuide } from './editor';
import { goTo } from './site-navigation';

export const SITE_EDITOR_TEST_IDS = {
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
	stylesPanel: 'blockera-site-editor-styles-panel',
	stylesActions: 'blockera-site-editor-styles-actions',
	templatesPanel: 'blockera-site-editor-templates-panel',
	templatesNav: 'blockera-site-editor-templates-nav',
	templatesNavAll: 'blockera-site-editor-templates-nav-all',
	templatesNavHomepage: 'blockera-site-editor-templates-nav-homepage-root',
	templatesNavHomepageStatus:
		'blockera-site-editor-templates-nav-homepage-root-status',
	templatesNavBlogPosts:
		'blockera-site-editor-templates-nav-homepage-blog-posts',
	templatesNavBlogPostsStatus:
		'blockera-site-editor-templates-nav-homepage-blog-posts-status',
	templatesNavHomepageFrontPage:
		'blockera-site-editor-templates-nav-homepage-fallback:front-page',
	templatesNavHomepageFrontPageStatus:
		'blockera-site-editor-templates-nav-homepage-fallback:front-page-status',
	templatesNavHomepageHome:
		'blockera-site-editor-templates-nav-homepage-fallback:home',
	templatesNavHomepageHomeStatus:
		'blockera-site-editor-templates-nav-homepage-fallback:home-status',
	templatesNavHomepageIndex:
		'blockera-site-editor-templates-nav-homepage-fallback:index',
	templatesNavHomepageIndexStatus:
		'blockera-site-editor-templates-nav-homepage-fallback:index-status',
	templatesNavHeader: 'blockera-site-editor-templates-nav-parts-header',
	templatesNavFooter: 'blockera-site-editor-templates-nav-parts-footer',
	templatesNavSidebar: 'blockera-site-editor-templates-nav-parts-sidebar',
	templatesNavSingular: 'blockera-site-editor-templates-nav-singular',
	templatesNavSingularStatus:
		'blockera-site-editor-templates-nav-singular-status',
	templatesNavSinglePost: 'blockera-site-editor-templates-nav-single',
	templatesNavSinglePage: 'blockera-site-editor-templates-nav-page',
	templatesNavAttachment: 'blockera-site-editor-templates-nav-attachment',
	templatesNavChildrenSingle:
		'blockera-site-editor-templates-nav-children:single',
	templatesNavChildrenPage:
		'blockera-site-editor-templates-nav-children:page',
	templatesNavCptBook:
		'blockera-site-editor-templates-nav-cpt-single:bo_book',
	templatesNavChildrenCptBook:
		'blockera-site-editor-templates-nav-children:cpt-single:bo_book',
	templatesNavArchive: 'blockera-site-editor-templates-nav-archive',
	templatesNavArchiveStatus:
		'blockera-site-editor-templates-nav-archive-status',
	templatesNavCategory: 'blockera-site-editor-templates-nav-category',
	templatesNavTag: 'blockera-site-editor-templates-nav-tag',
	templatesNavAuthor: 'blockera-site-editor-templates-nav-author',
	templatesNavDate: 'blockera-site-editor-templates-nav-date',
	templatesNavTaxonomy: 'blockera-site-editor-templates-nav-taxonomy',
	templatesNavChildrenCategory:
		'blockera-site-editor-templates-nav-children:category',
	templatesNavChildrenTag: 'blockera-site-editor-templates-nav-children:tag',
	templatesNavChildrenAuthor:
		'blockera-site-editor-templates-nav-children:author',
	templatesNavChildrenTaxonomy:
		'blockera-site-editor-templates-nav-children:taxonomy',
	templatesNavCptArchiveBook:
		'blockera-site-editor-templates-nav-cpt-archive:bo_book',
	templatesNavSearch: 'blockera-site-editor-templates-nav-search',
	templatesNavNotFound: 'blockera-site-editor-templates-nav-404',
	templatesNavChildrenSearch:
		'blockera-site-editor-templates-nav-children:search',
	templatesNavChildrenNotFound:
		'blockera-site-editor-templates-nav-children:404',
	templatesNavCustom: 'blockera-site-editor-templates-nav-custom',
	templatesNavAuthorWooCommerce:
		'blockera-site-editor-templates-nav-author:WooCommerce',
	templatesNavWooArchiveProduct:
		'blockera-site-editor-templates-nav-child:archive-product',
	templatesNavWooProductCat:
		'blockera-site-editor-templates-nav-child:taxonomy-product_cat',
	templatesNavWooProductTag:
		'blockera-site-editor-templates-nav-child:taxonomy-product_tag',
	templatesNavWooProductBrand:
		'blockera-site-editor-templates-nav-child:taxonomy-product_brand',
	templatesNavWooProductAttribute:
		'blockera-site-editor-templates-nav-child:taxonomy-product_attribute',
	templatesNavWooProductSearch:
		'blockera-site-editor-templates-nav-child:product-search-results',
	templatesNavWooSingleProduct:
		'blockera-site-editor-templates-nav-child:single-product',
	templatesNavWooCart: 'blockera-site-editor-templates-nav-child:page-cart',
	templatesNavWooCheckout:
		'blockera-site-editor-templates-nav-child:page-checkout',
	templatesNavWooOrderConfirmation:
		'blockera-site-editor-templates-nav-child:order-confirmation',
	templatesNavWooComingSoon:
		'blockera-site-editor-templates-nav-child:coming-soon',
	templatesNavCptSingleProduct:
		'blockera-site-editor-templates-nav-cpt-single:product',
	templatesNavCptArchiveProduct:
		'blockera-site-editor-templates-nav-cpt-archive:product',
	templatesMissing: 'blockera-site-editor-templates-missing',
	templatesMissingFallback: 'blockera-site-editor-templates-missing-fallback',
	templatesAddSpecific: 'blockera-site-editor-templates-add-specific',
	templatesAreaHub: 'blockera-site-editor-templates-area-hub',
	templatesAreaHubBanner: 'blockera-site-editor-templates-area-hub-banner',
	templatesAreaHubEmpty: 'blockera-site-editor-templates-area-hub-empty',
	templatesAreaHubManage: 'blockera-site-editor-templates-area-hub-manage',
	drillDown: 'blockera-site-editor-drill-down',
	drillDownBack: 'blockera-site-editor-drill-down-back',
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
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.header, {
			timeout: 60000,
		}).should('be.visible');
	});
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
 * Assert Styles / Identity / Homepage / Performance / Templates drill-down chrome:
 * branding stays, main nav collapses, back control present.
 */
export function assertSiteEditorDrillDown() {
	assertSiteEditorChrome();
	getSiteEditorNav().should('not.exist');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.drillDown, {
		timeout: 20000,
	}).should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.drillDownBack).should('be.visible');
}

/**
 * Assert Templates purpose-nav drill-down is mounted.
 *
 * Homepage click opens a live template/page preview (no content DataViews).
 * Restore All browse afterward so callers can assert core PageTemplates.
 */
export function assertSiteEditorTemplatesNav() {
	assertSiteEditorDrillDown();
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesPanel, {
		timeout: 20000,
	}).should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav).should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAll).should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepage).should(
		'be.visible'
	);
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepageFrontPage).should(
		'not.exist'
	);
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepage).click();
	/* Active homepage winner is hidden; other available layers (e.g. Index) show. */
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepageIndex).should(
		'be.visible'
	);
	/* Leave live preview (`/wp_template/...`) and remount PageTemplates browse. */
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAll).click();
	cy.location('search')
		.should('include', 'p=%2Ftemplate')
		.and('not.include', 'wp_template');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepageFrontPage).should(
		'not.exist'
	);
}

/**
 * Click drill-down Back and assert Design-root main nav is restored.
 *
 * @param {string} [routeFragment] Optional `p` path fragment that must leave the URL (e.g. `identity`).
 */
export function clickSiteEditorDrillDownBack(routeFragment) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.drillDownBack)
		.should('be.visible')
		.click();
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.drillDown).should('not.exist');
	if (routeFragment) {
		cy.location('search').should('not.include', routeFragment);
	}
	assertSiteEditorChrome();
	assertSiteEditorMainNav();
}

/**
 * Assert Blockera Site Editor chrome is mounted (branding under core SiteHub).
 */
export function assertSiteEditorChrome() {
	cy.get('body').should('have.class', 'has-blockera-site-editor-main-panel');
	cy.get('.edit-site-layout__sidebar > .edit-site-site-hub').should(
		'be.visible'
	);
	getSiteEditorHeader().should('be.visible');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.headerTitle).should(
		'contain.text',
		'Blockera One'
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
 * Authenticated REST helper using `wpApiSettings.nonce` + `rest_route`.
 *
 * @param {string} route Route after `/wp/v2/` (e.g. `settings`, `pages`).
 * @param {Object} [options] Cypress request options (`method`, `body`, …).
 * @return {Cypress.Chainable}
 */
export function siteEditorRestRequest(route, options = {}) {
	const testURL = (Cypress.env('testURL') || '').replace(/\/$/, '');
	const path = String(route || '').replace(/^\//, '');
	const url = `${testURL}/?rest_route=/wp/v2/${path}`;

	return cy.window().then((win) => {
		const nonce = win.wpApiSettings?.nonce;
		expect(nonce, 'wpApiSettings.nonce').to.be.a('string').and.not.be.empty;

		return cy.request({
			url,
			headers: {
				'X-WP-Nonce': nonce,
				...(options.headers || {}),
			},
			...options,
		});
	});
}

/**
 * Update a Site Editor settings field via authenticated REST `/wp/v2/settings`.
 *
 * @param {Object} body Settings payload.
 * @return {Cypress.Chainable}
 */
export function updateSiteSettingsViaRest(body) {
	return siteEditorRestRequest('settings', {
		method: 'POST',
		body,
	});
}

/**
 * Set Reading settings used by Templates Homepage purpose-nav.
 *
 * @param {{
 *   showOnFront: 'posts' | 'page',
 *   pageOnFront?: number | null,
 *   pageForPosts?: number | null,
 * }} options
 * @return {Cypress.Chainable}
 */
export function setReadingSettings({
	showOnFront,
	pageOnFront = null,
	pageForPosts = null,
}) {
	const body = {
		show_on_front: showOnFront,
	};

	if (showOnFront === 'page') {
		body.page_on_front = pageOnFront || 0;
		body.page_for_posts = pageForPosts || 0;
	} else {
		body.page_on_front = 0;
		body.page_for_posts = 0;
	}

	return updateSiteSettingsViaRest(body);
}

/**
 * Create a published page via REST.
 *
 * @param {{ title?: string, content?: string }} [options]
 * @return {Cypress.Chainable<number>} Resolves to the page id.
 */
export function createSiteEditorPage({
	title = `E2E Page ${Date.now()}`,
	content = '<!-- wp:paragraph --><p>E2E page</p><!-- /wp:paragraph -->',
} = {}) {
	return siteEditorRestRequest('pages', {
		method: 'POST',
		body: {
			title,
			content,
			status: 'publish',
		},
	}).then((response) => {
		expect(response.status).to.be.oneOf([200, 201]);
		const id = response.body?.id;
		expect(id, 'created page id').to.be.a('number');
		return id;
	});
}

/**
 * Delete a page via REST (force).
 *
 * @param {number|string} pageId
 * @return {Cypress.Chainable}
 */
export function deleteSiteEditorPage(pageId) {
	if (!pageId) {
		return cy.wrap(null);
	}

	return siteEditorRestRequest(`pages/${pageId}?force=true`, {
		method: 'DELETE',
		failOnStatusCode: false,
	});
}

/**
 * Create a custom `wp_template` via REST (e.g. slug `front-page`).
 *
 * @param {{ slug: string, title?: string, content?: string }} options
 * @return {Cypress.Chainable<{ id: string|number, slug: string }>}
 */
export function createWpTemplate({
	slug,
	title,
	content = '<!-- wp:paragraph --><p>E2E template</p><!-- /wp:paragraph -->',
}) {
	expect(slug, 'template slug').to.be.a('string').and.not.be.empty;

	return siteEditorRestRequest('templates', {
		method: 'POST',
		body: {
			slug,
			title: title || slug,
			content,
			status: 'publish',
		},
	}).then((response) => {
		expect(response.status).to.be.oneOf([200, 201]);
		const id = response.body?.id;
		expect(id, 'created template id').to.exist;
		return { id, slug: response.body?.slug || slug };
	});
}

/**
 * Delete a `wp_template` via REST / data store (force).
 *
 * @param {string|number} templateId Theme-style id (`theme//slug`) or numeric.
 * @return {Cypress.Chainable}
 */
export function deleteWpTemplate(templateId) {
	if (!templateId) {
		return cy.wrap(null);
	}

	const id = String(templateId);

	return cy.window().then((win) => {
		const deleteRecord = win.wp?.data?.dispatch('core')?.deleteEntityRecord;

		if (typeof deleteRecord === 'function') {
			return deleteRecord('postType', 'wp_template', id, {
				force: true,
			}).catch(() => null);
		}

		// Encode the full id so `theme//slug` does not collapse in rest_route.
		const encoded = encodeURIComponent(id);
		return siteEditorRestRequest(`templates/${encoded}?force=true`, {
			method: 'DELETE',
			failOnStatusCode: false,
		});
	});
}

/**
 * Open Templates purpose-nav drill-down from Design root.
 *
 * Save Hub can overlay the sticky templates nav — assert mounted, not painted.
 */
export function openTemplatesPurposeNav() {
	clickSiteEditorNav(SITE_EDITOR_TEST_IDS.navTemplates);
	cy.location('search').should('include', 'template');
	assertSiteEditorDrillDown();
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesPanel, {
		timeout: 20000,
	}).should('exist');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
		.scrollIntoView({ block: 'start', ensureScrollable: false })
		.should('exist');
}

const TEMPLATES_PART_AREA_NAV = {
	header: SITE_EDITOR_TEST_IDS.templatesNavHeader,
	footer: SITE_EDITOR_TEST_IDS.templatesNavFooter,
	sidebar: SITE_EDITOR_TEST_IDS.templatesNavSidebar,
};

const TEMPLATES_PART_AREA_LABELS = {
	header: {
		banner: 'Global site header',
		manage: 'Manage All Headers',
		empty: 'No site header yet.',
		/** Core `default_template_part_areas` label shown on Patterns page. */
		patternsTitle: 'Header',
	},
	footer: {
		banner: 'Global site footer',
		manage: 'Manage All Footers',
		empty: 'No site footer yet.',
		patternsTitle: 'Footer',
	},
	sidebar: {
		banner: 'Global site sidebar',
		manage: 'Manage All Sidebars',
		empty: 'No site sidebar yet.',
		// Theme registers sidebar as uncategorized; Patterns title may fall back.
		patternsTitle: null,
	},
};

/**
 * Assert Header / Footer / Sidebar rows in Templates purpose-nav.
 *
 * @param {{ sidebarVisible?: boolean }} options
 */
export function assertTemplatesPartsNav({ sidebarVisible = true } = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHeader).should(
		'be.visible'
	);
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavFooter).should(
		'be.visible'
	);

	if (sidebarVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSidebar).should(
			'be.visible'
		);
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSidebar).should(
			'not.exist'
		);
	}
}

/**
 * Open a General Area Hub part from Templates purpose-nav.
 *
 * @param {'header' | 'footer' | 'sidebar'} area
 */
export function openTemplatesPartArea(area) {
	const testId = TEMPLATES_PART_AREA_NAV[area];
	expect(testId, `known templates part area: ${area}`).to.be.a('string');
	cy.getByDataTest(testId).should('be.visible').click();
}

/**
 * Assert Area Hub chrome for a part area.
 *
 * @param {{
 *   area: 'header' | 'footer' | 'sidebar',
 *   mode?: 'preview' | 'empty' | 'edit',
 * }} options
 */
export function assertTemplatesAreaHub({ area, mode = 'preview' }) {
	const labels = TEMPLATES_PART_AREA_LABELS[area];
	expect(labels, `known templates part area: ${area}`).to.exist;

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHub, {
		timeout: 20000,
	})
		.should('be.visible')
		.and('have.attr', 'data-area', area);

	if (mode !== 'edit') {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav).should(
			'be.visible'
		);
		cy.getByDataTest(TEMPLATES_PART_AREA_NAV[area]).should(
			'have.class',
			'is-active'
		);
	}

	if (mode === 'empty') {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubEmpty)
			.should('be.visible')
			.and('contain.text', labels.empty);
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubBanner).should(
			'not.exist'
		);
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubManage)
			.should('be.visible')
			.and('contain.text', labels.manage);
		cy.location('search').should('include', `partsArea=${area}`);
		return;
	}

	if (mode === 'edit') {
		// Full-canvas edit hides the Templates sidebar; only assert hub chrome.
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHub).should(
			'have.attr',
			'data-canvas',
			'edit'
		);
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubBanner).should(
			'not.exist'
		);
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubManage).should(
			'not.exist'
		);
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubEmpty).should(
			'not.exist'
		);
		cy.location('search').should('include', 'wp_template_part');
		cy.location('search').should('include', `partsArea=${area}`);
		cy.location('search').should('include', 'canvas=edit');
		return;
	}

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubBanner)
		.should('be.visible')
		.and('contain.text', labels.banner)
		.and(
			'contain.text',
			'Editing this updates it everywhere this part is used.'
		);
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubEmpty).should(
		'not.exist'
	);
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHubManage)
		.should('be.visible')
		.and('contain.text', labels.manage);
	cy.location('search').should('include', 'wp_template_part');
	cy.location('search').should('include', `partsArea=${area}`);
}

/**
 * Assert navigation landed on Patterns template-parts area list.
 *
 * Core router stores area filters as siblings of `p`
 * (`?p=/pattern&postType=wp_template_part&categoryId=header`), not nested
 * inside `p`. Nested form opens general Patterns and must fail this assert.
 *
 * Note: Patterns is a drill-down screen — Design root nav (incl. Patterns
 * main-nav item) is not mounted, so we assert URL + Patterns chrome instead.
 *
 * @param {'header' | 'footer' | 'sidebar'} area
 */
export function assertNavigatedToPatternsTemplatePartArea(area) {
	const labels = TEMPLATES_PART_AREA_LABELS[area];
	expect(labels, `known templates part area: ${area}`).to.exist;

	cy.location('search', { timeout: 20000 }).should((search) => {
		const params = new URLSearchParams(String(search));
		expect(params.get('p')).to.equal('/pattern');
		expect(params.get('postType')).to.equal('wp_template_part');
		expect(params.get('categoryId')).to.equal(area);
		expect(params.get('partsArea')).to.equal(null);
	});

	// Left Design root (Templates hub / main nav) for Patterns drill-down.
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAreaHub).should('not.exist');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.nav).should('not.exist');

	cy.get('.edit-site-page-patterns-dataviews', { timeout: 20000 }).should(
		'exist'
	);

	if (labels.patternsTitle) {
		cy.get('.edit-site-page-patterns-dataviews', { timeout: 20000 }).should(
			'have.attr',
			'aria-label',
			labels.patternsTitle
		);
		cy.get('.edit-site-sidebar-navigation-item[aria-current="true"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.and(($el) => {
				const href = decodeURIComponent($el.attr('href') || '');
				expect(href).to.include('postType=wp_template_part');
				expect(href).to.include(`categoryId=${area}`);
			});
	}
}

/**
 * Toggle Site Editor `canvas` query via history (patched pushState emits navigate).
 *
 * @param {'edit' | 'view'} mode
 */
export function setSiteEditorCanvasMode(mode) {
	cy.window().then((win) => {
		const url = new URL(win.location.href);
		if (mode === 'edit') {
			url.searchParams.set('canvas', 'edit');
		} else {
			url.searchParams.delete('canvas');
		}
		win.history.pushState(
			typeof win.history.state === 'object' && win.history.state
				? { ...win.history.state }
				: {},
			'',
			`${url.pathname}${url.search}${url.hash}`
		);
		win.dispatchEvent(new PopStateEvent('popstate'));
	});
}

/**
 * Enter canvas edit the same way users do: click the view-mode Editor iframe.
 * Core sets `canvas=edit` via router history.navigate (pushState).
 *
 * Template-part edit can open Core’s welcome Guide over the Area Hub; dismiss
 * it before callers assert hub chrome (CI flakes on covered `is-edit-canvas`).
 */
export function enterSiteEditorCanvasEditFromPreview() {
	cy.get(
		'iframe.edit-site-visual-editor__editor-canvas[aria-label="Edit"], .edit-site-visual-editor__editor-canvas[aria-label="Edit"], iframe.edit-site-visual-editor__editor-canvas',
		{ timeout: 20000 }
	)
		.first()
		.should('be.visible')
		.click({ force: true });

	cy.location('search', { timeout: 20000 }).should('include', 'canvas=edit');

	// Guide often mounts a tick after `canvas=edit` — wait once if not present yet.
	cy.get('body').then(($body) => {
		if (
			$body.find(
				'.components-modal__screen-overlay, .components-guide__page'
			).length === 0
		) {
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(1500);
		}
	});
	closeWelcomeGuide();
}

/**
 * Click core “Open Navigation” (exit full-canvas edit back to navigator).
 */
export function clickSiteEditorOpenNavigation() {
	cy.get('button[aria-label="Open Navigation"]', { timeout: 20000 })
		.should('be.visible')
		.click();
}

/**
 * Expand Homepage branch and assert section / inline fallback state.
 *
 * @param {{
 *   homepageStatus?: string | null,
 *   blogHomeVisible?: boolean,
 *   blogHomeStatus?: string | null,
 *   children?: Array<{ testId: string, statusTestId?: string, statusLabel?: string, visible?: boolean }>,
 *   absentChildTestIds?: string[],
 * }} options
 */
export function assertTemplatesHomepageSection({
	homepageStatus = null,
	blogHomeVisible = false,
	blogHomeStatus = null,
	children = [],
	absentChildTestIds = [],
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepage).should(
		'be.visible'
	);

	if (homepageStatus) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepageStatus)
			.should('be.visible')
			.and('contain.text', homepageStatus);
	} else {
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavHomepageStatus
		).should('not.exist');
	}

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavHomepage).click();

	if (blogHomeVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavBlogPosts).should(
			'be.visible'
		);
		if (blogHomeStatus) {
			cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavBlogPostsStatus)
				.should('be.visible')
				.and('contain.text', blogHomeStatus);
		}
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavBlogPosts).should(
			'not.exist'
		);
	}

	children.forEach(
		({ testId, statusTestId, statusLabel, visible = true }) => {
			if (!visible) {
				cy.getByDataTest(testId).should('not.exist');
				return;
			}

			cy.getByDataTest(testId).should('be.visible');
			if (statusLabel) {
				cy.getByDataTest(statusTestId || `${testId}-status`)
					.should('be.visible')
					.and('contain.text', statusLabel);
			}
		}
	);

	absentChildTestIds.forEach((testId) => {
		cy.getByDataTest(testId).should('not.exist');
	});
}

/**
 * Assert Single Templates purpose-nav section state.
 *
 * @param {{
 *   singularVisible?: boolean,
 *   singularStatus?: string | null,
 *   attachmentVisible?: boolean,
 *   cptBookVisible?: boolean,
 *   cptBookLabelIncludes?: string,
 *   children?: Array<{ testId: string, count?: number, visible?: boolean }>,
 *   absentChildTestIds?: string[],
 * }} options
 */
export function assertTemplatesSingleSection({
	singularVisible = false,
	singularStatus = null,
	attachmentVisible = false,
	cptBookVisible = false,
	cptBookLabelIncludes = 'Book',
	children = [],
	absentChildTestIds = [],
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSinglePost)
		.should('be.visible')
		.and('contain.text', 'Single Post');
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSinglePage)
		.should('be.visible')
		.and('contain.text', 'Single Page');

	if (singularVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSingular)
			.should('be.visible')
			.and('contain.text', 'Singular');
		if (singularStatus) {
			cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSingularStatus)
				.should('be.visible')
				.and('contain.text', singularStatus);
		}
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavSingular).should(
			'not.exist'
		);
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavSingularStatus
		).should('not.exist');
	}

	if (attachmentVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAttachment).should(
			'be.visible'
		);
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAttachment).should(
			'not.exist'
		);
	}

	if (cptBookVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavCptBook)
			.should('be.visible')
			.and('contain.text', cptBookLabelIncludes);
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavCptBook).should(
			'not.exist'
		);
	}

	children.forEach(({ testId, count, visible = true }) => {
		if (!visible) {
			cy.getByDataTest(testId).should('not.exist');
			return;
		}

		cy.getByDataTest(testId).should('be.visible');
		if (typeof count === 'number') {
			cy.getByDataTest(testId)
				.find('.blockera-site-editor-templates-nav__count')
				.should('be.visible')
				.and('contain.text', String(count));
		}
	});

	absentChildTestIds.forEach((testId) => {
		cy.getByDataTest(testId).should('not.exist');
	});
}

/**
 * Assert Archive Templates purpose-nav section visibility / children.
 *
 * All Archives + Categories are always present. Tags / Authors / Date /
 * Taxonomy / CPT archive rows honor hideWhenEmpty.
 *
 * @param {{
 *   archiveStatus?: string|null,
 *   tagVisible?: boolean,
 *   authorVisible?: boolean,
 *   dateVisible?: boolean,
 *   taxonomyVisible?: boolean,
 *   cptBookArchiveVisible?: boolean,
 *   cptBookLabelIncludes?: string,
 *   children?: Array<{ testId: string, count?: number, visible?: boolean }>,
 *   absentChildTestIds?: string[],
 * }} options
 */
export function assertTemplatesArchiveSection({
	archiveStatus = 'Fallback',
	tagVisible = false,
	authorVisible = false,
	dateVisible = false,
	taxonomyVisible = false,
	cptBookArchiveVisible = false,
	cptBookLabelIncludes = 'Book',
	children = [],
	absentChildTestIds = [],
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
		.find('.blockera-site-editor-templates-nav__section')
		.contains(
			'.blockera-site-editor-templates-nav__section-title',
			'Archive Templates'
		)
		.should('be.visible');

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavArchive)
		.should('be.visible')
		.and('contain.text', 'All Archives');
	if (archiveStatus) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavArchiveStatus)
			.should('be.visible')
			.and('contain.text', archiveStatus);
	}

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavCategory)
		.should('be.visible')
		.and('contain.text', 'Categories');

	if (tagVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavTag)
			.should('be.visible')
			.and('contain.text', 'Tags');
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavTag).should(
			'not.exist'
		);
	}

	if (authorVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAuthor)
			.should('be.visible')
			.and('contain.text', 'Authors');
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavAuthor).should(
			'not.exist'
		);
	}

	if (dateVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavDate)
			.should('be.visible')
			.and('contain.text', 'Date');
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavDate).should(
			'not.exist'
		);
	}

	if (taxonomyVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavTaxonomy)
			.should('be.visible')
			.and('contain.text', 'Taxonomy');
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavTaxonomy).should(
			'not.exist'
		);
	}

	if (cptBookArchiveVisible) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavCptArchiveBook)
			.should('be.visible')
			.and('contain.text', cptBookLabelIncludes);
	} else {
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavCptArchiveBook
		).should('not.exist');
	}

	children.forEach(({ testId, count, visible = true }) => {
		if (!visible) {
			cy.getByDataTest(testId).should('not.exist');
			return;
		}

		cy.getByDataTest(testId).should('be.visible');
		if (typeof count === 'number') {
			cy.getByDataTest(testId)
				.find('.blockera-site-editor-templates-nav__count')
				.should('be.visible')
				.and('contain.text', String(count));
		}
	});

	absentChildTestIds.forEach((testId) => {
		cy.getByDataTest(testId).should('not.exist');
	});
}

/**
 * Scroll a Templates nav row into the sticky sidebar viewport (Save Hub can cover
 * lower Special / WooCommerce rows otherwise).
 *
 * @param {string} testId
 * @return {Cypress.Chainable}
 */
function scrollTemplatesNavItemIntoView(testId) {
	return cy
		.getByDataTest(testId)
		.scrollIntoView({ block: 'center', ensureScrollable: false })
		.should(($el) => {
			expect(
				$el[0].getBoundingClientRect().height,
				`${testId} layout height`
			).to.be.greaterThan(0);
		});
}

/**
 * Open a Templates purpose-nav row (scroll past Save Hub, force click).
 *
 * @param {string} testId SITE_EDITOR_TEST_IDS.templatesNav*
 * @param {{ boFilterIncludes?: string }} [options]
 */
export function openTemplatesNavItem(testId, { boFilterIncludes } = {}) {
	const filter =
		boFilterIncludes ||
		String(testId).replace(/^blockera-site-editor-templates-nav-/, '');

	scrollTemplatesNavItemIntoView(testId).click({ force: true });

	cy.location('search').should((search) => {
		const decoded = decodeURIComponent(String(search));
		expect(decoded).to.include(`boFilter=${filter}`);
	});
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav).should('exist');
}

/**
 * Assert Special Templates purpose-nav section visibility / children.
 *
 * Search + 404 are always present (no hideWhenEmpty / status / children).
 * Rows sit above WooCommerce — Save Hub may cover them; scroll before asserting.
 *
 * @param {{
 *   absentChildTestIds?: string[],
 * }} options
 */
export function assertTemplatesSpecialSection({
	absentChildTestIds = [
		SITE_EDITOR_TEST_IDS.templatesNavChildrenSearch,
		SITE_EDITOR_TEST_IDS.templatesNavChildrenNotFound,
	],
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
		.find('.blockera-site-editor-templates-nav__section')
		.contains(
			'.blockera-site-editor-templates-nav__section-title',
			'Special Templates'
		)
		.scrollIntoView({ block: 'center', ensureScrollable: false })
		.should('exist');

	// Prefer exist over be.visible — Save Hub overlays fixed/sticky sidebar rows.
	scrollTemplatesNavItemIntoView(
		SITE_EDITOR_TEST_IDS.templatesNavSearch
	).should('exist');
	scrollTemplatesNavItemIntoView(
		SITE_EDITOR_TEST_IDS.templatesNavNotFound
	).should('exist');

	absentChildTestIds.forEach((testId) => {
		cy.getByDataTest(testId).should('not.exist');
	});
}

/** Curated WC purpose-nav rows (labels match templates-woocommerce.ts). */
const WOO_TEMPLATES_NAV_ROWS = [
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooArchiveProduct,
		label: 'Shop Page',
		role: 'top',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooProductCat,
		label: 'Products by Category',
		role: 'shop-child',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooProductTag,
		label: 'Products by Tag',
		role: 'shop-child',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooProductBrand,
		label: 'Products by Brand',
		role: 'shop-child',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooProductAttribute,
		label: 'Products by Attribute',
		role: 'shop-child',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooProductSearch,
		label: 'Product Search Page',
		role: 'shop-child',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooSingleProduct,
		label: 'Single Product',
		role: 'top',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooCart,
		label: 'Cart Page',
		role: 'top',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooCheckout,
		label: 'Checkout Page',
		role: 'top',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooOrderConfirmation,
		label: 'Order Confirmation',
		role: 'top',
	},
	{
		testId: () => SITE_EDITOR_TEST_IDS.templatesNavWooComingSoon,
		label: 'Coming Soon Page',
		role: 'top',
	},
];

/**
 * Scoped Cypress chain for the WooCommerce Templates purpose-nav section.
 */
export function getTemplatesWooCommerceSection() {
	return cy
		.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
		.find('.blockera-site-editor-templates-nav__section')
		.contains(
			'.blockera-site-editor-templates-nav__section-title',
			'WooCommerce Templates'
		)
		.parents('.blockera-site-editor-templates-nav__section');
}

/**
 * Open a WooCommerce Templates nav row and assert `boFilter` + nav still mounted.
 *
 * @param {string} testId SITE_EDITOR_TEST_IDS.templatesNavWoo*
 */
export function openTemplatesWooCommerceItem(testId) {
	openTemplatesNavItem(testId);
}

/**
 * Assert WooCommerce Templates section (requires WC-enabled wp-env).
 * Section sits immediately before Other; curated rows, nesting, order, exclusions.
 *
 * @param {{
 *   assertOrder?: boolean,
 *   assertLabels?: boolean,
 *   assertNesting?: boolean,
 *   assertExclusions?: boolean,
 *   assertUniqueness?: boolean,
 * }} [options]
 */
export function assertTemplatesWooCommerceSection({
	assertOrder = true,
	assertLabels = true,
	assertNesting = true,
	assertExclusions = true,
	assertUniqueness = true,
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
		.find('.blockera-site-editor-templates-nav__section')
		.then(($sections) => {
			const titles = [...$sections]
				.map((section) =>
					section
						.querySelector(
							'.blockera-site-editor-templates-nav__section-title'
						)
						?.textContent?.trim()
				)
				.filter(Boolean);

			const wooIndex = titles.indexOf('WooCommerce Templates');
			const otherIndex = titles.indexOf('Other');

			expect(wooIndex, 'WooCommerce Templates section').to.be.gte(0);
			expect(otherIndex, 'Other section').to.be.gte(0);
			expect(wooIndex).to.be.lt(otherIndex);
		});

	const allTestIds = WOO_TEMPLATES_NAV_ROWS.map((row) => row.testId());

	allTestIds.forEach((testId) => {
		scrollTemplatesNavItemIntoView(testId).should('exist');
	});

	if (assertLabels) {
		WOO_TEMPLATES_NAV_ROWS.forEach(({ testId, label }) => {
			scrollTemplatesNavItemIntoView(testId()).should(
				'contain.text',
				label
			);
		});
	}

	if (assertNesting) {
		const shopChildTestIds = WOO_TEMPLATES_NAV_ROWS.filter(
			(row) => row.role === 'shop-child'
		).map((row) => row.testId());

		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNavWooArchiveProduct)
			.parents('.blockera-site-editor-templates-nav__item-shell')
			.parent()
			.within(() => {
				shopChildTestIds.forEach((testId) => {
					cy.getByDataTest(testId).should('have.class', 'is-child');
				});
			});
	}

	if (assertOrder) {
		const topLevelOrder = WOO_TEMPLATES_NAV_ROWS.filter(
			(row) => row.role === 'top'
		).map((row) => row.testId());
		const shopChildOrder = WOO_TEMPLATES_NAV_ROWS.filter(
			(row) => row.role === 'shop-child'
		).map((row) => row.testId());

		getTemplatesWooCommerceSection()
			.find('.blockera-site-editor-templates-nav__items [data-test]')
			.then(($rows) => {
				const testIds = [...$rows]
					.map((el) => el.getAttribute('data-test'))
					.filter(Boolean);

				const topIndexes = topLevelOrder.map((id) =>
					testIds.indexOf(id)
				);
				topIndexes.forEach((index, i) => {
					expect(index, topLevelOrder[i]).to.be.gte(0);
					if (i > 0) {
						expect(
							topIndexes[i - 1],
							`${topLevelOrder[i - 1]} before ${topLevelOrder[i]}`
						).to.be.lt(index);
					}
				});

				const childIndexes = shopChildOrder.map((id) =>
					testIds.indexOf(id)
				);
				childIndexes.forEach((index, i) => {
					expect(index, shopChildOrder[i]).to.be.gte(0);
					if (i > 0) {
						expect(
							childIndexes[i - 1],
							`${shopChildOrder[i - 1]} before ${shopChildOrder[i]}`
						).to.be.lt(index);
					}
				});

				// Shop children sit between Shop Page and Single Product.
				expect(childIndexes[0]).to.be.gt(topIndexes[0]);
				expect(childIndexes[childIndexes.length - 1]).to.be.lt(
					topIndexes[1]
				);
			});
	}

	if (assertExclusions) {
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavAuthorWooCommerce
		).should('not.exist');
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavCptSingleProduct
		).should('not.exist');
		cy.getByDataTest(
			SITE_EDITOR_TEST_IDS.templatesNavCptArchiveProduct
		).should('not.exist');
	}

	if (assertUniqueness) {
		allTestIds.forEach((testId) => {
			cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesNav)
				.find(`[data-test="${testId}"]`)
				.should('have.length', 1);
		});
	}
}

/**
 * Assert the missing-base empty state for a purpose filter.
 *
 * @param {{
 *   headingIncludes: string,
 *   messageIncludes?: string,
 *   hasFallbackLink?: boolean,
 * }} options
 */
export function assertTemplatesMissingBase({
	headingIncludes,
	messageIncludes = 'There is no specific',
	hasFallbackLink = true,
} = {}) {
	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesMissing, {
		timeout: 20000,
	})
		.should('be.visible')
		.and('contain.text', headingIncludes)
		.and('contain.text', messageIncludes);

	cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesAddSpecific)
		.should('be.visible')
		.and('contain.text', 'Add a specific template');

	if (hasFallbackLink) {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesMissingFallback).should(
			'be.visible'
		);
	} else {
		cy.getByDataTest(SITE_EDITOR_TEST_IDS.templatesMissingFallback).should(
			'not.exist'
		);
	}
}

/**
 * Hide a shipped Special template (theme file rename + delete custom DB posts).
 *
 * @param {'search'|'404'} slug
 * @return {Cypress.Chainable}
 */
export function hideSpecialThemeTemplate(slug) {
	return cy
		.task('wpTemplateDeleteBySlug', { slug })
		.then(() => setThemeTemplateHidden(slug, true))
		.then((result) => {
			expect(result?.ok, result?.message || `hide ${slug}`).to.eq(true);
		});
}

/**
 * Restore a shipped Special template (custom DB cleanup + unhide theme file).
 *
 * @param {'search'|'404'} slug
 * @return {Cypress.Chainable}
 */
export function restoreSpecialThemeTemplate(slug) {
	return cy
		.task('wpTemplateDeleteBySlug', { slug })
		.then(() => setThemeTemplateHidden(slug, false))
		.then((result) => {
			expect(result?.ok, result?.message || `restore ${slug}`).to.eq(
				true
			);
		});
}

/**
 * Hover a status badge and assert tooltip heading / body copy.
 *
 * @param {string} statusTestId Badge `data-test`.
 * @param {{ heading: string, bodyIncludes: string }} options
 */
export function assertStatusTooltip(statusTestId, { heading, bodyIncludes }) {
	// Homepage/nav status Tooltip delay is 200ms; realHover + pointer events for
	// headless Chrome (WP Tooltip listens to mouseenter). Hover twice — lower
	// sidebar rows are flaky on first hover in headless Chrome.
	const hoverStatus = () => {
		cy.getByDataTest(statusTestId)
			.should('be.visible')
			.scrollIntoView({ block: 'center' })
			.trigger('pointerover', { force: true })
			.trigger('mouseover', { force: true })
			.trigger('mouseenter', { force: true })
			.safeRealHover();

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(700);
	};

	hoverStatus();
	hoverStatus();

	cy.get('body')
		.find(
			'[role="tooltip"], .components-tooltip, .blockera-component-tooltip',
			{ timeout: 10000 }
		)
		.should('be.visible')
		.and('contain.text', heading)
		.and('contain.text', bodyIncludes);
}

/**
 * Hide or restore a theme HTML template file (`home.html` ↔ `-home.html`).
 *
 * @param {string} slug Template slug without extension.
 * @param {boolean} hidden
 * @return {Cypress.Chainable}
 */
export function setThemeTemplateHidden(slug, hidden) {
	return cy.task('themeTemplateSetHidden', { slug, hidden });
}

/**
 * Hide or restore a theme template part (`parts/{slug}.html` ↔ `parts/-{slug}.html`).
 *
 * @param {string} slug Part slug without extension.
 * @param {boolean} hidden
 * @return {Cypress.Chainable}
 */
export function setThemePartHidden(slug, hidden) {
	return cy.task('themePartSetHidden', { slug, hidden });
}

/**
 * Ensure a canonical template part is unavailable (theme file + custom DB posts).
 *
 * @param {string} slug
 * @return {Cypress.Chainable}
 */
export function ensureNoTemplatePart(slug) {
	return cy
		.task('themePartSetHidden', { slug, hidden: true })
		.then((result) => {
			expect(result?.ok, result?.message || `hide part ${slug}`).to.eq(
				true
			);
		})
		.then(() => cy.task('wpTemplatePartDeleteBySlug', { slug }))
		.then(() => {
			cy.window({ log: false }).then((win) => {
				const invalidate =
					win.wp?.data?.dispatch('core')?.invalidateResolution;
				if (typeof invalidate !== 'function') {
					return;
				}
				invalidate('getEntityRecords', [
					'postType',
					'wp_template_part',
					{ per_page: -1 },
				]);
			});
		});
}

/**
 * Restore a previously hidden theme template part file.
 *
 * @param {string} slug
 * @return {Cypress.Chainable}
 */
export function restoreThemePart(slug) {
	return cy
		.task('themePartSetHidden', { slug, hidden: false })
		.then((result) => {
			expect(result?.ok, result?.message || `restore part ${slug}`).to.eq(
				true
			);
		});
}

/**
 * Install a theme template from an e2e fixture file into `templates/{slug}.html`.
 *
 * @param {string} slug
 * @param {string} fixturePath Path relative to theme root.
 * @return {Cypress.Chainable}
 */
export function installThemeTemplateFixture(slug, fixturePath) {
	return cy.task('themeTemplateInstallFixture', { slug, fixturePath });
}

/**
 * Remove `templates/{slug}.html` (fixture-installed templates).
 *
 * @param {string} slug
 * @return {Cypress.Chainable}
 */
export function removeThemeTemplateFile(slug) {
	return cy.task('themeTemplateRemoveFile', { slug });
}

/**
 * Ensure no Front Page template is available (theme file + custom DB posts).
 *
 * @return {Cypress.Chainable}
 */
export function ensureNoFrontPageTemplate() {
	return cy
		.task('themeTemplateRemoveFile', { slug: 'front-page' })
		.then(() => cy.task('wpTemplateDeleteBySlug', { slug: 'front-page' }))
		.then(() => {
			// Invalidate only when Site Editor data store is already mounted.
			cy.window({ log: false }).then((win) => {
				const invalidate =
					win.wp?.data?.dispatch('core')?.invalidateResolution;
				if (typeof invalidate !== 'function') {
					return;
				}
				invalidate('getEntityRecords', [
					'postType',
					'wp_template',
					{ per_page: -1 },
				]);
				invalidate('getEntityRecords', [
					'root',
					'registeredTemplate',
					{ per_page: -1 },
				]);
			});
		});
}

/**
 * Install theme `front-page.html` from the Homepage e2e fixture.
 *
 * @return {Cypress.Chainable}
 */
export function installFrontPageThemeTemplate() {
	return installThemeTemplateFixture(
		'front-page',
		'packages/blockera-one/js/test/fixtures/homepage/front-page.html'
	).then((result) => {
		expect(result?.ok, result?.message || 'install front-page').to.eq(true);
	});
}

const SINGLE_TEMPLATES_FIXTURE_DIR =
	'packages/blockera-one/js/test/fixtures/single-templates';

const ARCHIVE_TEMPLATES_FIXTURE_DIR =
	'packages/blockera-one/js/test/fixtures/archive-templates';

/**
 * Ensure theme `singular.html` is unavailable (remove visible + hidden copies).
 *
 * @return {Cypress.Chainable}
 */
export function ensureSingularHidden() {
	// Restore `-singular.html` → `singular.html` when present, then delete.
	return setThemeTemplateHidden('singular', false)
		.then(() => cy.task('themeTemplateRemoveFile', { slug: 'singular' }))
		.then(() => cy.task('wpTemplateDeleteBySlug', { slug: 'singular' }));
}

/**
 * Ensure theme `singular.html` is visible (restore hidden file or install fixture).
 *
 * @return {Cypress.Chainable}
 */
export function ensureSingularVisible() {
	return setThemeTemplateHidden('singular', false).then((result) => {
		if (result?.ok) {
			return result;
		}

		// No theme file at all — install the e2e fixture.
		return installThemeTemplateFixture(
			'singular',
			`${SINGLE_TEMPLATES_FIXTURE_DIR}/singular.html`
		).then((installResult) => {
			expect(
				installResult?.ok,
				installResult?.message || 'install singular'
			).to.eq(true);
			return installResult;
		});
	});
}

/**
 * Install theme `attachment.html` from the Single Templates e2e fixture.
 *
 * @return {Cypress.Chainable}
 */
export function installAttachmentThemeTemplate() {
	return installThemeTemplateFixture(
		'attachment',
		`${SINGLE_TEMPLATES_FIXTURE_DIR}/attachment.html`
	).then((result) => {
		expect(result?.ok, result?.message || 'install attachment').to.eq(true);
	});
}

/**
 * Ensure no Attachment template is available (theme file + custom DB posts).
 *
 * @return {Cypress.Chainable}
 */
export function ensureNoAttachmentTemplate() {
	return cy
		.task('themeTemplateRemoveFile', { slug: 'attachment' })
		.then(() => cy.task('wpTemplateDeleteBySlug', { slug: 'attachment' }))
		.then(() => {
			cy.window({ log: false }).then((win) => {
				const invalidate =
					win.wp?.data?.dispatch('core')?.invalidateResolution;
				if (typeof invalidate !== 'function') {
					return;
				}
				invalidate('getEntityRecords', [
					'postType',
					'wp_template',
					{ per_page: -1 },
				]);
				invalidate('getEntityRecords', [
					'root',
					'registeredTemplate',
					{ per_page: -1 },
				]);
			});
		});
}

/**
 * Install a Single Templates theme fixture by slug.
 *
 * @param {string} slug
 * @param {string} [fileName] Fixture file name (defaults to `${slug}.html`).
 * @return {Cypress.Chainable}
 */
export function installSingleTemplatesFixture(slug, fileName) {
	const fixtureFile = fileName || `${slug}.html`;
	return installThemeTemplateFixture(
		slug,
		`${SINGLE_TEMPLATES_FIXTURE_DIR}/${fixtureFile}`
	).then((result) => {
		expect(result?.ok, result?.message || `install ${slug}`).to.eq(true);
	});
}

/**
 * Install an Archive Templates theme fixture by slug.
 *
 * @param {string} slug
 * @param {string} [fileName] Fixture file name (defaults to `${slug}.html`).
 * @return {Cypress.Chainable}
 */
export function installArchiveTemplatesFixture(slug, fileName) {
	const fixtureFile = fileName || `${slug}.html`;
	return installThemeTemplateFixture(
		slug,
		`${ARCHIVE_TEMPLATES_FIXTURE_DIR}/${fixtureFile}`
	).then((result) => {
		expect(result?.ok, result?.message || `install ${slug}`).to.eq(true);
	});
}

/**
 * Remove an installed theme template file and any custom DB template posts.
 *
 * @param {string} slug
 * @return {Cypress.Chainable}
 */
export function ensureNoThemeTemplate(slug) {
	return cy
		.task('themeTemplateRemoveFile', { slug })
		.then(() => cy.task('wpTemplateDeleteBySlug', { slug }))
		.then(() => {
			cy.window({ log: false }).then((win) => {
				const invalidate =
					win.wp?.data?.dispatch('core')?.invalidateResolution;
				if (typeof invalidate !== 'function') {
					return;
				}
				invalidate('getEntityRecords', [
					'postType',
					'wp_template',
					{ per_page: -1 },
				]);
				invalidate('getEntityRecords', [
					'root',
					'registeredTemplate',
					{ per_page: -1 },
				]);
			});
		});
}

const WOOCOMMERCE_TEMPLATES_FIXTURE_DIR =
	'packages/blockera-one/js/test/fixtures/woocommerce-templates';

/**
 * WC taxonomy templates that are registry-known but not shipped as plugin HTML
 * files (WordPress only exposes them after a theme/custom template exists).
 */
export const WOOCOMMERCE_TAXONOMY_TEMPLATE_FIXTURE_SLUGS = [
	'taxonomy-product_cat',
	'taxonomy-product_tag',
	'taxonomy-product_brand',
];

/**
 * Install theme fixtures so Shop Page can nest Category / Tag / Brand rows.
 *
 * @return {Cypress.Chainable}
 */
export function installWooCommerceTaxonomyTemplateFixtures() {
	return WOOCOMMERCE_TAXONOMY_TEMPLATE_FIXTURE_SLUGS.reduce(
		(chain, slug) =>
			chain.then(() =>
				installThemeTemplateFixture(
					slug,
					`${WOOCOMMERCE_TEMPLATES_FIXTURE_DIR}/${slug}.html`
				).then((result) => {
					expect(
						result?.ok,
						result?.message || `install ${slug}`
					).to.eq(true);
				})
			),
		cy.wrap(null, { log: false })
	);
}

/**
 * Remove WooCommerce taxonomy template fixtures installed for e2e.
 *
 * @return {Cypress.Chainable}
 */
export function removeWooCommerceTaxonomyTemplateFixtures() {
	return WOOCOMMERCE_TAXONOMY_TEMPLATE_FIXTURE_SLUGS.reduce(
		(chain, slug) => chain.then(() => ensureNoThemeTemplate(slug)),
		cy.wrap(null, { log: false })
	);
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
