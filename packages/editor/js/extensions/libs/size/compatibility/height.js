// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { isSpecialUnit } from '@blockera/controls';

export function heightFromWPCompatibility({
	attributes,
	blockId,
	insideBlockInspector = true,
}: {
	attributes: Object,
	blockId?: string,
	insideBlockInspector?: boolean,
}): Object {
	if (attributes?.blockeraHeight?.value !== '') {
		return attributes;
	}

	switch (blockId) {
		// Blocks that support global styles dimensions.height
		case 'core/image':
			// Check block-level attribute (insideBlockInspector) or global style context
			// Block inspector: attributes.height
			if (insideBlockInspector && attributes?.height !== undefined) {
				attributes.blockeraHeight = {
					value: attributes?.height,
				};
			}

			// Global styles: attributes.dimensions.height
			if (
				!insideBlockInspector &&
				attributes?.dimensions?.height !== undefined
			) {
				attributes.blockeraHeight = {
					value: attributes?.dimensions?.height,
				};
			}

			return attributes;

		case 'core/spacer':
		case 'core/post-featured-image':
			if (attributes?.height !== undefined) {
				attributes.blockeraHeight = {
					value: attributes?.height,
				};
			}

			return attributes;
	}

	return attributes;
}

export function heightToWPCompatibility({
	newValue,
	ref,
	blockId,
	insideBlockInspector = true,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
	insideBlockInspector?: boolean,
}): Object {
	switch (blockId) {
		// Blocks that support global styles dimensions.height
		case 'core/image':
			if ('reset' === ref?.current?.action) {
				return insideBlockInspector
					? {
							height: undefined,
					  }
					: {
							dimensions: {
								height: undefined,
							},
					  };
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('px') // only px units
			) {
				return insideBlockInspector
					? {
							height: undefined,
					  }
					: {
							dimensions: {
								height: undefined,
							},
					  };
			}

			return insideBlockInspector
				? {
						height: newValue,
				  }
				: {
						dimensions: {
							height: newValue,
						},
				  };

		// A string attribute for width with unit
		case 'core/spacer':
		case 'core/post-featured-image':
			if ('reset' === ref?.current?.action) {
				return {
					height: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				newValue.endsWith('func')
			) {
				return {
					height: undefined,
				};
			}

			return {
				height: newValue,
			};
	}

	return null;
}
