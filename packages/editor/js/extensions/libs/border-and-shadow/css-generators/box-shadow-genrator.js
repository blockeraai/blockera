/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/value-addons';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function BoxShadowGenerator(id, props) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraBoxShadow)?.length) {
		return '';
	}

	const properties = {
		'box-shadow': [],
	};

	// Collect all properties
	Object.entries(attributes?.blockeraBoxShadow)?.map(([, item]) => {
		if (!item.isVisible) {
			return undefined;
		}

		properties['box-shadow'].push(
			`${item.type === 'inner' ? 'inset' : ''} ${getValueAddonRealValue(
				item.x
			)} ${getValueAddonRealValue(item.y)} ${getValueAddonRealValue(
				item.blur
			)} ${getValueAddonRealValue(item.spread)} ${getValueAddonRealValue(
				item.color
			)}`
		);

		return undefined;
	});

	const toReturnProperties =
		properties['box-shadow'].length > 0
			? {
					'box-shadow':
						properties['box-shadow'].join(', ') + ' !important',
			  }
			: {};

	return createCssDeclarations({
		properties: toReturnProperties,
	});
}
