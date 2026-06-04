// @flow

/**
 * External dependencies
 */
import { prependHTTP } from '@wordpress/url';

export const CORE_ICON_BLOCK_NAME = 'core/icon';

export const NEW_TAB_TARGET = '_blank';
export const NEW_TAB_REL = 'noopener';
export const NOFOLLOW_REL = 'nofollow';

/**
 * Editor block schema fallback (canonical definition lives in icon/block.php).
 * Used when mergeBlockSettings runs before PHP inline-script store registration.
 */
export const CORE_ICON_LINK_ATTRIBUTES = {
	href: {
		type: 'string',
	},
	linkTarget: {
		type: 'string',
	},
	rel: {
		type: 'string',
	},
};

/**
 * Map LinkControl values to core/icon href, linkTarget, and rel (image/button pattern).
 *
 * @param {Object} args Current link fields.
 * @return {Object} Attributes patch for setAttributes.
 */
export function getUpdatedCoreIconLinkAttributes({
	rel = '',
	href = '',
	opensInNewTab,
	nofollow,
}: {
	rel?: string,
	href?: string,
	opensInNewTab?: boolean,
	nofollow?: boolean,
}): Object {
	let linkTarget;
	let updatedRel = rel;

	if (opensInNewTab) {
		linkTarget = NEW_TAB_TARGET;
		updatedRel = updatedRel?.includes(NEW_TAB_REL)
			? updatedRel
			: `${updatedRel} ${NEW_TAB_REL}`.trim();
	} else {
		const relRegex = new RegExp(`\\b${NEW_TAB_REL}\\s*`, 'g');
		updatedRel = updatedRel?.replace(relRegex, '').trim();
		linkTarget = undefined;
	}

	if (nofollow) {
		updatedRel = updatedRel?.includes(NOFOLLOW_REL)
			? updatedRel
			: `${updatedRel} ${NOFOLLOW_REL}`.trim();
	} else {
		const relRegex = new RegExp(`\\b${NOFOLLOW_REL}\\s*`, 'g');
		updatedRel = updatedRel?.replace(relRegex, '').trim();
	}

	const nextHref = href ? prependHTTP(href) : undefined;

	return {
		href: nextHref,
		linkTarget,
		rel: updatedRel || undefined,
	};
}
