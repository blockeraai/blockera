// @flow
/**
 * External dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export function useDisplayBlockControls(): Object {
	const { isSelected, clientId, name } = useBlockEditContext();
	return useSelect(
		(select) => {
			if (isSelected) {
				return true;
			}

			const {
				getBlockName,
				isFirstMultiSelectedBlock,
				getMultiSelectedBlockClientIds,
			} = select('core/block-editor');

			if (isFirstMultiSelectedBlock(clientId)) {
				return getMultiSelectedBlockClientIds().every(
					(id) => getBlockName(id) === name
				);
			}

			return false;
		},
		[clientId, isSelected, name]
	);
}
