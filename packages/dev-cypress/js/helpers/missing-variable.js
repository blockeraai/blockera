/**
 * Helpers for missing-variable popover E2E (unlink + recreate flows).
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	saveSiteEditorDirtyEntities,
} from './editor';
import { getEditedGlobalStylesSetting } from './global-styles';
import { createPost, openSiteEditor } from './site-navigation';

const GLOBAL_STYLES_KIND = 'root';
const GLOBAL_STYLES_NAME = 'globalStyles';

/** Edited-entity `settings.*` dot paths for custom preset arrays. */
export const MISSING_VARIABLE_CUSTOM_PRESET_PATH = {
	'font-size': 'typography.fontSizes.custom',
	'line-height': 'blockera.blockeraLineHeights.custom',
	color: 'color.palette.custom',
	spacing: 'spacing.spacingSizes.custom',
	'width-size': 'blockera.blockeraWidthSizes.custom',
	'border-radius': 'border.radiusSizes.custom',
	border: 'blockera.blockeraBorder.presets.custom',
	shadow: 'shadow.presets.custom',
	'text-shadow': 'blockera.blockeraTextShadow.presets.custom',
	transform: 'blockera.blockeraTransform.presets.custom',
	transition: 'blockera.blockeraTransition.presets.custom',
	filter: 'blockera.blockeraFilter.presets.custom',
	'linear-gradient': 'color.gradients.custom',
	'radial-gradient': 'color.gradients.custom',
};

function getCoreDataStoreApis(win) {
	const registry = win.wp?.data;
	const store = win.wp?.coreData?.store;

	if (!registry || !store) {
		throw new Error('wp.data / wp.coreData.store is not available');
	}

	return {
		select: registry.select(store),
		dispatch: registry.dispatch(store),
	};
}

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
 * Opens the missing-variable popover on the current `@container` alias (or document).
 */
export function openMissingVariablePopover() {
	const chain = cy.get('@container', { log: false }).then(($container) => {
		if ($container && $container.length) {
			cy.wrap($container).within(() => {
				cy.get('[data-test="value-addon-deleted"]').click({
					force: true,
				});
			});
			return;
		}

		cy.get('[data-test="value-addon-deleted"]')
			.first()
			.click({ force: true });
	});

	return chain;
}

export function clickMissingVariableUnlink() {
	return cy
		.getByDataTest('missing-variable-unlink', { timeout: 15000 })
		.click({ force: true });
}

export function clickMissingVariableRecreate() {
	return cy
		.getByDataTest('missing-variable-recreate', { timeout: 15000 })
		.click({ force: true });
}

/**
 * @param {{ unlink?: boolean, recreate?: boolean, remove?: boolean }} expected
 */
export function assertMissingVariableActions({ unlink, recreate, remove }) {
	if (unlink) {
		cy.getByDataTest('missing-variable-unlink').should('exist');
	} else {
		cy.getByDataTest('missing-variable-unlink').should('not.exist');
	}

	if (recreate) {
		cy.getByDataTest('missing-variable-recreate').should('exist');
	} else {
		cy.getByDataTest('missing-variable-recreate').should('not.exist');
	}

	if (remove) {
		cy.getByDataTest('missing-variable-remove').should('exist');
	} else {
		cy.getByDataTest('missing-variable-remove').should('not.exist');
	}
}

/**
 * Appends a custom preset row to the edited global styles entity.
 *
 * @param {string} variableType
 * @param {Record<string, unknown>} row
 */
export function injectCustomPresetRow(variableType, row) {
	const dotPath = MISSING_VARIABLE_CUSTOM_PRESET_PATH[variableType];

	if (!dotPath) {
		throw new Error(`Unknown variable type: ${variableType}`);
	}

	return cy.window().then((win) => {
		const apis = getCoreDataStoreApis(win);
		const recordId = getGlobalStylesIdFromStore(apis);

		if (recordId === undefined || recordId === null || recordId === '') {
			throw new Error('Global styles entity id is not available');
		}

		const record = apis.select.getEditedEntityRecord(
			GLOBAL_STYLES_KIND,
			GLOBAL_STYLES_NAME,
			recordId
		);

		const settings = JSON.parse(JSON.stringify(record?.settings ?? {}));
		const keys = dotPath.split('.');
		let parent = settings;

		for (let i = 0; i < keys.length - 1; i++) {
			if (parent[keys[i]] === undefined) {
				parent[keys[i]] = {};
			}
			parent = parent[keys[i]];
		}

		const lastKey = keys[keys.length - 1];
		const rows = Array.isArray(parent[lastKey]) ? parent[lastKey] : [];
		parent[lastKey] = [...rows, row];

		apis.dispatch.editEntityRecord(
			GLOBAL_STYLES_KIND,
			GLOBAL_STYLES_NAME,
			recordId,
			{ settings }
		);
	});
}

/**
 * Seeds a custom global-styles preset in Site Editor, saves, then opens a new post.
 *
 * @param {string} variableType
 * @param {Record<string, unknown>} row
 */
export function seedCustomPresetAndOpenPostEditor(variableType, row) {
	openSiteEditor();
	injectCustomPresetRow(variableType, row);
	saveSiteEditorDirtyEntities();
	createPost();
	cy.getIframeBody({ timeout: 30000 }).should('exist');
}

/**
 * Removes a custom preset row from the edited global styles entity (simulates deletion).
 *
 * @param {string} variableType
 * @param {string} slug
 */
export function removeCustomPresetFromGlobalStyles(variableType, slug) {
	const dotPath = MISSING_VARIABLE_CUSTOM_PRESET_PATH[variableType];

	if (!dotPath) {
		throw new Error(`Unknown variable type: ${variableType}`);
	}

	return cy.window().then((win) => {
		const apis = getCoreDataStoreApis(win);
		const recordId = getGlobalStylesIdFromStore(apis);

		if (recordId === undefined || recordId === null || recordId === '') {
			throw new Error('Global styles entity id is not available');
		}

		const record = apis.select.getEditedEntityRecord(
			GLOBAL_STYLES_KIND,
			GLOBAL_STYLES_NAME,
			recordId
		);

		const settings = JSON.parse(JSON.stringify(record?.settings ?? {}));
		const keys = dotPath.split('.');
		let parent = settings;

		for (let i = 0; i < keys.length - 1; i++) {
			if (parent[keys[i]] === undefined) {
				return;
			}
			parent = parent[keys[i]];
		}

		const lastKey = keys[keys.length - 1];
		const rows = parent[lastKey];

		if (!Array.isArray(rows)) {
			return;
		}

		parent[lastKey] = rows.filter((row) => row?.slug !== slug);

		apis.dispatch.editEntityRecord(
			GLOBAL_STYLES_KIND,
			GLOBAL_STYLES_NAME,
			recordId,
			{ settings }
		);
	});
}

/**
 * Asserts a custom preset exists in edited global styles.
 *
 * @param {string} variableType
 * @param {{ slug: string, name?: string }} expected
 */
export function assertCustomPresetInGlobalStyles(variableType, { slug, name }) {
	const dotPath = MISSING_VARIABLE_CUSTOM_PRESET_PATH[variableType];

	return getEditedGlobalStylesSetting(dotPath).then((rows) => {
		expect(Array.isArray(rows), dotPath).to.equal(true);
		const row = rows.find((item) => item?.slug === slug);
		expect(row, `custom preset ${slug}`).to.not.equal(undefined);
		if (name !== undefined) {
			expect(row.name).to.equal(name);
		}
		return row;
	});
}

/**
 * Asserts a recreated custom preset row has meaningful stored payload (not just slug/name).
 *
 * @param {string} variableType
 * @param {string} slug
 */
export function assertRecreatePresetHasStoredValue(variableType, slug) {
	return assertCustomPresetInGlobalStyles(variableType, { slug }).then(
		(row) => {
			switch (variableType) {
				case 'shadow':
				case 'text-shadow':
					expect(row.shadow, `${variableType} shadow CSS`).to.be.a(
						'string'
					);
					expect(String(row.shadow).trim()).to.not.equal('');
					break;
				case 'border':
					expect(row.border, 'border side').to.be.an('object');
					expect(
						String(row.border?.width ?? '').trim() ||
							String(row.border?.style ?? '').trim() ||
							String(row.border?.color ?? '').trim()
					).to.not.equal('');
					break;
				case 'transform':
				case 'filter':
				case 'transition':
					expect(row.items, `${variableType} items`).to.be.an(
						'array'
					);
					expect(row.items.length).to.be.greaterThan(0);
					break;
				case 'border-radius':
				case 'spacing':
				case 'width-size':
				case 'font-size':
				case 'line-height':
					expect(String(row.size ?? '').trim()).to.not.equal('');
					break;
				default:
					break;
			}
		}
	);
}

/**
 * Asserts the selected block attribute is no longer a value-addon binding.
 *
 * @param {string} attributeKey
 */
export function expectBlockAttrIsScalarValueAddon(attributeKey) {
	getWPDataObject().then((data) => {
		const value = getSelectedBlock(data, attributeKey);
		expect(value?.isValueAddon).to.not.equal(true);
	});
}

/**
 * Asserts the selected block still binds to a variable value-addon with the given slug.
 *
 * @param {string} attributeKey
 * @param {string} slug
 */
export function expectBlockAttrStillBoundToVariable(attributeKey, slug) {
	getWPDataObject().then((data) => {
		const value = getSelectedBlock(data, attributeKey);
		const serialized = JSON.stringify(value);
		expect(serialized).to.include(slug);
		expect(serialized).to.include('"isValueAddon":true');
	});
}

/**
 * Skip helper when custom preset add is unavailable (free tier quota).
 * Must run after navigating to a screen that exposes add controls (Global Styles
 * preset screen or an open variable picker).
 */
export function skipWhenCustomPresetAddUnavailable() {
	cy.get('body').then(function ($body) {
		const canAdd =
			$body.find(
				'[data-test="variable-picker-header-add-custom-variable"]:visible, [data-test^="variable-picker-section-add-"]:visible, [data-test^="global-styles-preset-add-"]:visible, [data-cy^="global-styles-preset-add-"]:visible'
			).length > 0;

		if (!canAdd) {
			this.skip();
		}
	});
}

/** Shared theme.json custom preset row metadata. */
export const CUSTOM_PRESET_ROW_META = {
	isVisible: true,
	deletable: true,
	cloneable: true,
	visibilitySupport: true,
};

/**
 * Asserts recreated preset row fields match expected structured payload.
 *
 * @param {string} variableType
 * @param {string} slug
 * @param {{
 *   size?: string,
 *   border?: { width?: string, style?: string, color?: string },
 *   shadowContains?: string[],
 *   itemsLength?: number,
 *   itemsMatch?: Record<string, unknown>,
 * }} expected
 */
export function assertRecreatePresetRowFields(
	variableType,
	slug,
	expected = {}
) {
	return assertRecreatePresetHasStoredValue(variableType, slug).then(
		(row) => {
			if (expected.size !== undefined) {
				expect(String(row.size ?? '').trim()).to.equal(expected.size);
			}

			if (expected.border) {
				expect(row.border, 'border side').to.be.an('object');
				if (expected.border.width !== undefined) {
					expect(String(row.border.width ?? '').trim()).to.equal(
						expected.border.width
					);
				}
				if (expected.border.style !== undefined) {
					expect(String(row.border.style ?? '').trim()).to.equal(
						expected.border.style
					);
				}
				if (expected.border.color !== undefined) {
					expect(String(row.border.color ?? '').trim()).to.equal(
						expected.border.color
					);
				}
			}

			if (Array.isArray(expected.shadowContains)) {
				for (const needle of expected.shadowContains) {
					expect(String(row.shadow ?? '')).to.include(needle);
				}
			}

			if (expected.itemsLength !== undefined) {
				expect(row.items).to.have.length(expected.itemsLength);
			}

			if (expected.itemsMatch) {
				expect(row.items?.[0]).to.include(expected.itemsMatch);
			}
		}
	);
}

/**
 * Appends a paragraph block bound to a missing variable without cached settings.value.
 *
 * @param {object} options
 * @param {string} options.attrKey Blockera attribute key.
 * @param {string} options.variableType Preset variable type.
 * @param {string} options.id Variable id / slug token.
 * @param {string} options.name Display name.
 * @param {string} options.varCssVar Full CSS var token (e.g. `--wp--preset--transform--foo`).
 * @param {string} [options.blockContent] Paragraph text.
 */
export function appendMissingVariableBlockWithoutCachedValue({
	attrKey,
	variableType,
	id,
	name,
	varCssVar,
	blockContent = 'Missing variable without cached value',
}) {
	const binding = {
		isValueAddon: true,
		valueType: 'variable',
		name,
		settings: {
			id,
			name,
			type: variableType,
			var: varCssVar,
		},
	};

	appendBlocks(
		`<!-- wp:paragraph ${JSON.stringify({ [attrKey]: binding })} -->` +
			`<p>${blockContent}</p>` +
			'<!-- /wp:paragraph -->'
	);
}
