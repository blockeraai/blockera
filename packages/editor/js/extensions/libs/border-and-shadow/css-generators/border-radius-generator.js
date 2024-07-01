/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function BorderRadiusGenerator(id, props) {
	const { attributes } = props;

	if (!attributes?.blockeraBorderRadius) {
		return '';
	}

	const properties = {};

	if (attributes?.blockeraBorderRadius?.type === 'all') {
		properties['border-radius'] = getValueAddonRealValue(
			attributes.blockeraBorderRadius.all
		);
	} else {
		properties['border-top-left-radius'] = getValueAddonRealValue(
			attributes.blockeraBorderRadius.topLeft
		);
		properties['border-top-right-radius'] = getValueAddonRealValue(
			attributes.blockeraBorderRadius.topRight
		);
		properties['border-bottom-left-radius'] = getValueAddonRealValue(
			attributes.blockeraBorderRadius.bottomLeft
		);
		properties['border-bottom-right-radius'] = getValueAddonRealValue(
			attributes.blockeraBorderRadius.bottomRight
		);
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		properties,
	});
}
