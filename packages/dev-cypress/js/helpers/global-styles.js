/**
 * Site editor helpers for Blockera global styles → color variable presets.
 *
 * Entity access mirrors `packages/global-styles-ui/js/context/global-styles-provider.ts`:
 * `store` from `@wordpress/core-data` (`wp.coreData.store`), `__experimentalGetCurrentGlobalStylesId`,
 * `canUser( 'update', { kind: 'root', name: 'globalStyles', id } )`, and `editEntityRecord` for the same entity.
 */
import { closeWelcomeGuide } from './editor';
import { openSiteEditor } from './site-navigation';

const COLORS_OVERRIDE_CLASS = 'is-open-blockera-colors-navigation-override';

/** Matches `global-styles-provider` entity tuple. */
const GLOBAL_STYLES_KIND = 'root';
const GLOBAL_STYLES_NAME = 'globalStyles';

/**
 * @param {Window} win
 * @return {{ select: Function, dispatch: Function }} core-data `select` / `dispatch` (same as `useSelect(coreStore)` / `useDispatch(coreStore)`).
 */
function getCoreDataStoreApis(win) {
	const registry = win.wp?.data;
	const store = win.wp?.coreData?.store;

	if (!registry) {
		throw new Error('wp.data is not available');
	}

	if (!store) {
		throw new Error(
			'wp.coreData.store is not available; load the block editor with @wordpress/core-data.'
		);
	}

	return {
		select: registry.select(store),
		dispatch: registry.dispatch(store),
	};
}

/**
 * @param {{ select: Function }} apis
 * @return {string|number|undefined} Same id as `useGlobalStylesUserConfig` → `_globalStylesId`.
 */
function getGlobalStylesIdFromStore(apis) {
	const { select } = apis;

	if (typeof select.__experimentalGetCurrentGlobalStylesId === 'function') {
		return select.__experimentalGetCurrentGlobalStylesId();
	}

	if (typeof select.getCurrentGlobalStylesId === 'function') {
		return select.getCurrentGlobalStylesId();
	}

	return undefined;
}

/**
 * Discards in-memory edits for the global styles entity when `getEditedEntityRecord` differs from
 * the base `getEntityRecord` (same tuple as `global-styles-provider`). Resets by `editEntityRecord`
 * with `styles`, `settings`, and `_links` taken from the base record (same fields Blockera mutates).
 *
 * Skips when `canUser( 'update', { kind, name, id } )` is false (read-only path in provider).
 *
 * @return {Cypress.Chainable} Cypress chain after discard logic runs in the app window.
 */
export function resetGlobalStylesEntityRecord() {
	return cy.window().then((win) => {
		const { select, dispatch } = getCoreDataStoreApis(win);
		const recordId = getGlobalStylesIdFromStore({ select });

		if (recordId === undefined || recordId === null || recordId === '') {
			throw new Error(
				'No global styles entity id: open the Site Editor and wait until global styles resolve.'
			);
		}

		if (typeof select.canUser === 'function') {
			const userCanEditGlobalStyles = select.canUser('update', {
				kind: GLOBAL_STYLES_KIND,
				name: GLOBAL_STYLES_NAME,
				id: recordId,
			});

			if (userCanEditGlobalStyles === false) {
				return;
			}

			if (typeof userCanEditGlobalStyles !== 'boolean') {
				throw new Error(
					'Global styles `canUser` not resolved yet; retry after the Site Editor finishes loading.'
				);
			}
		}

		const kind = GLOBAL_STYLES_KIND;
		const name = GLOBAL_STYLES_NAME;

		if (typeof dispatch.editEntityRecord !== 'function') {
			throw new Error(
				'core-data editEntityRecord is not available; cannot discard global styles edits.'
			);
		}

		dispatch.editEntityRecord(kind, name, recordId, {
			styles: {},
			settings: {},
		});
	});
}

/**
 * Opens Site Editor, Blockera global styles Colors list, and the Color variables screen.
 */
export function openGlobalStylesColorPaletteScreen(
	{ reset } = { reset: true }
) {
	openSiteEditor();

	if (reset) {
		resetGlobalStylesEntityRecord();
	}

	cy.openGlobalStylesPanel();

	closeWelcomeGuide();

	cy.get('button[id="/colors"]').eq(1).should('exist').click({ force: true });

	cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);

	cy.get('.edit-site-global-styles-sidebar__navigator-screen', {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-colors-presets-count').should('exist');

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(1000);

	cy.getByDataTest('global-styles-nav-colors-palette').click({ force: true });

	cy.getByDataTest('global-styles-color-palette-screen', {
		timeout: 20000,
	}).should('be.visible');
}
