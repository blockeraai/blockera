/**
 * Blockera dependencies
 */
import { cloneObject, isEmpty, isUndefined } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { getBlockSupportStyleEngineConfig } from '../../../utils';
export function WidthGenerator(id, props, options) {
	const { attributes, supports } = props;

	const width = getValueAddonRealValue(attributes.blockeraWidth);
	let value = '';

	if (width !== attributes.blockeraWidth.default) {
		value = width;
	} else if (!isUndefined(attributes.width) && !isEmpty(attributes.width)) {
		value = attributes.width;
	}

	if (!value) {
		return '';
	}

	// We should not change the original supports object.
	const clonedSupports = cloneObject(supports);

	if (supports?.blockeraStyleEngineConfig?.blockeraWidth) {
		if (!clonedSupports?.blockeraWidth) {
			clonedSupports.blockeraWidth = {};
		}

		clonedSupports.blockeraWidth['style-engine-config'] =
			supports?.blockeraStyleEngineConfig.blockeraWidth;
	}

	const properties = {};

	let key = getBlockSupportStyleEngineConfig(
		clonedSupports,
		'blockeraWidth',
		'width',
		props.currentBlock,
		'width'
	);

	if (value === 'stretch' && key === 'width') {
		if (!options.important) {
			key =
				'width: 100%; width: -moz-available; width: -webkit-fill-available; width';
		} else {
			key =
				'width: 100% !important; width: -moz-available !important; width: -webkit-fill-available !important; width';
		}
	}

	properties[key] = value;

	return createCssDeclarations({
		options,
		properties,
	});
}
