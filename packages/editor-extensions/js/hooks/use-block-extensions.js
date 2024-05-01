// @flow
/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { STORE_NAME } from '../store/constants';

export function useBlockExtensions(extensionName: string): Object {
	return useSelect((select) => {
		const {
			getBlockExtensions,
			getBlockExtensionBy,
			hasBlockExtensionField,
		} = select(STORE_NAME);

		return {
			extensions: getBlockExtensions().filter(
				({ type, name }) =>
					name !== extensionName &&
					'extension' === type &&
					hasBlockExtensionField(extensionName, name)
			),
			hasExtensionSupport: hasBlockExtensionField,
			currentExtension: getBlockExtensionBy('targetBlock', extensionName),
			blockType: select('core/blocks').getBlockType(extensionName),
		};
	});
}
