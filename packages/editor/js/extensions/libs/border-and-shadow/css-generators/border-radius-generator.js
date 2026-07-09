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
export function BorderRadiusGenerator(id, props, options) {
	const { attributes, supports, blockeraStyleEngineConfig } = props;

	if (!attributes?.blockeraBorderRadius) {
		return '';
	}

	// We should not change the original supports object.
	const clonedSupports = cloneObject(supports);

	if (blockeraStyleEngineConfig?.blockeraBorderRadius) {
		clonedSupports.blockeraBorderRadius['style-engine-config'] =
			blockeraStyleEngineConfig.blockeraBorderRadius;
	}

	const properties = {};

	if (attributes?.blockeraBorderRadius?.type === 'all') {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'all',
				props.currentBlock,
				'border-radius'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.all);
	} else {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topLeft',
				props.currentBlock,
				'border-top-left-radius'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topLeft);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topRight',
				props.currentBlock,
				'border-top-right-radius'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topRight);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomLeft',
				props.currentBlock,
				'border-bottom-left-radius'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.bottomLeft);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomRight',
				props.currentBlock,
				'border-bottom-right-radius'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.bottomRight);
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		options,
		properties,
	});
}
