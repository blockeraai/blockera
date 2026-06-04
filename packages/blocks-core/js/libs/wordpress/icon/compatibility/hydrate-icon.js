// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEmpty } from '@blockera/utils';

/**
 * Hydrate blockeraIcon from the core/icon entity slug when Blockera icon data is empty.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Updated attributes.
 */
export function hydrateBlockeraIconFromCoreEntity(attributes: Object): Object {
	const coreIconSlug = attributes?.icon;

	const existingRenderedIcon = attributes?.blockeraIcon?.value?.renderedIcon;

	if (
		!coreIconSlug ||
		(existingRenderedIcon && existingRenderedIcon !== '')
	) {
		return attributes;
	}

	const entity = select('core')?.getEntityRecord(
		'root',
		'icon',
		coreIconSlug
	);
	const content = entity?.content;

	if (!content || typeof content !== 'string') {
		return attributes;
	}

	let encodedRenderedIcon = '';

	try {
		encodedRenderedIcon = btoa(unescape(encodeURIComponent(content)));
	} catch (e) {
		return attributes;
	}

	attributes.blockeraIcon = {
		value: {
			icon: coreIconSlug,
			library: 'wp',
			uploadSVG: '',
			renderedIcon: encodedRenderedIcon,
			svgString: '',
		},
	};

	return attributes;
}
