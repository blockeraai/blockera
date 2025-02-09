/**
 * Blockera dependencies
 */
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

	if (blockeraStyleEngineConfig?.blockeraBorderRadius) {
		supports.blockeraBorderRadius['style-engine-config'] =
			blockeraStyleEngineConfig.blockeraBorderRadius;
	}

	const properties = {};

	if (attributes?.blockeraBorderRadius?.type === 'all') {
		properties[
			getBlockSupportStyleEngineConfig(
				supports,
				'blockeraBorderRadius',
				'all'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.all);
	} else {
		properties[
			getBlockSupportStyleEngineConfig(
				supports,
				'blockeraBorderRadius',
				'topLeft'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topLeft);
		properties[
			getBlockSupportStyleEngineConfig(
				supports,
				'blockeraBorderRadius',
				'topRight'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.topRight);
		properties[
			getBlockSupportStyleEngineConfig(
				supports,
				'blockeraBorderRadius',
				'bottomLeft'
			)
		] = getValueAddonRealValue(attributes.blockeraBorderRadius.bottomLeft);
		properties[
			getBlockSupportStyleEngineConfig(
				supports,
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
