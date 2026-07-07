// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getIcon } from '@blockera/icons';
import {
	getBlockeraIconValue,
	hasBlockeraIconValue,
} from '@blockera/feature-icon/src/icon-attribute-utils';

/**
 * Internal dependencies
 */
import { stripCoreIconNamespace, toCoreIconAttribute } from './core-icon-slug';

/**
 * Whether blockeraIcon should be hydrated from the core/icon `icon` attribute.
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean}
 */
export function needsCoreIconHydration(attributes: Object): boolean {
	const coreIconSlug = attributes?.icon;

	if (!coreIconSlug || typeof coreIconSlug !== 'string') {
		return false;
	}

	return !hasBlockeraIconValue(getBlockeraIconValue(attributes));
}

/**
 * Encode SVG markup for blockeraIcon.renderedIcon storage.
 *
 * @param {string} content SVG markup.
 * @return {string} Base64-encoded markup or empty string on failure.
 */
export function encodeCoreIconRenderedIcon(content: string): string {
	if (!content || typeof content !== 'string') {
		return '';
	}

	try {
		return btoa(unescape(encodeURIComponent(content)));
	} catch (e) {
		return '';
	}
}

/**
 * Build blockeraIcon value from a core/icon slug and optional entity SVG content.
 *
 * @param {string} coreIconSlug Raw core/icon attribute slug.
 * @param {string} [entityContent] SVG markup from the WP icon entity.
 * @return {Object|null} blockeraIcon value object or null when icon cannot be resolved.
 */
export function buildBlockeraIconValueFromCoreSlug(
	coreIconSlug: string,
	entityContent?: string
): Object | null {
	if (!coreIconSlug || typeof coreIconSlug !== 'string') {
		return null;
	}

	const blockeraSlug = stripCoreIconNamespace(coreIconSlug);
	const encodedRenderedIcon =
		entityContent && typeof entityContent === 'string'
			? encodeCoreIconRenderedIcon(entityContent)
			: '';

	if (encodedRenderedIcon || getIcon(blockeraSlug, 'wp')) {
		return {
			icon: blockeraSlug,
			library: 'wp',
			uploadSVG: '',
			renderedIcon: encodedRenderedIcon,
			svgString: '',
		};
	}

	return null;
}

/**
 * Resolve icon entity content from the core data store (sync read).
 *
 * @param {string} coreIconSlug Raw core/icon attribute slug.
 * @return {string} SVG markup or empty string.
 */
export function getCoreIconEntityContent(coreIconSlug: string): string {
	const coreDataStore = select('core');

	if (!coreDataStore || !coreIconSlug) {
		return '';
	}

	const entitySlug = toCoreIconAttribute(
		stripCoreIconNamespace(coreIconSlug)
	);

	let entity = coreDataStore.getEntityRecord('root', 'icon', entitySlug);

	if (!entity && entitySlug !== coreIconSlug) {
		entity = coreDataStore.getEntityRecord('root', 'icon', coreIconSlug);
	}

	const content = entity?.content;

	return typeof content === 'string' ? content : '';
}

/**
 * Hydrate blockeraIcon from the core/icon entity slug when Blockera icon data is empty.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Updated attributes.
 */
export function hydrateBlockeraIconFromCoreEntity(attributes: Object): Object {
	if (!needsCoreIconHydration(attributes)) {
		return attributes;
	}

	const coreIconSlug = attributes?.icon;
	const entityContent = getCoreIconEntityContent(coreIconSlug);
	const blockeraIconValue = buildBlockeraIconValueFromCoreSlug(
		coreIconSlug,
		entityContent
	);

	if (!blockeraIconValue) {
		return attributes;
	}

	attributes.blockeraIcon = {
		value: blockeraIconValue,
	};

	return attributes;
}
