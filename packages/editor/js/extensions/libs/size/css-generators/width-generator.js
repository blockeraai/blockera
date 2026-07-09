/**
 * Blockera dependencies
 */
import { cloneObject } from '@blockera/utils';
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

	properties[
		getBlockSupportStyleEngineConfig(
			clonedSupports,
			'blockeraWidth',
			'width',
			props.currentBlock,
			'width'
		)
	] = value;

	return createCssDeclarations({
		options,
		properties,
	});
}
