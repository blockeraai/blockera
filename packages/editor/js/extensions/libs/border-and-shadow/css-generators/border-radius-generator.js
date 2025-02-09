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
export function BorderRadiusGenerator(id, props) {
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
				'all'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.all);
	} else {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topLeft'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topLeft);
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topRight'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topRight);
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomLeft'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.bottomLeft);
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomRight'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.bottomRight);
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		properties,
	});
}
