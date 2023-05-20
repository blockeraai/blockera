/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useBlockEditContext } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { STORE_NAME } from '../store/constants';

export function getExtendedProps(
	defaultProps: Object,
	extensionProps: Object
): Object {
	for (const key in extensionProps) {
		if (!Object.hasOwnProperty.call(extensionProps, key)) {
			continue;
		}

		const newProp = extensionProps[key];

		if ('className' === key) {
			defaultProps = {
				...defaultProps,
				className: classnames(defaultProps?.className || '', newProp),
			};

			continue;
		}

		if (!defaultProps[key]) {
			defaultProps[key] = newProp;

			continue;
		}

		defaultProps = {
			...defaultProps,
			[key]: {
				...defaultProps[key],
				...newProp,
			},
		};
	}

	return defaultProps;
}

export function useDisplayBlockControls() {
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

export function useBlockExtensions(blockName: string): Object {
	return useSelect((select) => {
		const {
			getBlockExtension,
			getBlockExtensions,
			hasBlockExtensionSupport,
		} = select(STORE_NAME);

		return {
			extensions: getBlockExtensions(),
			hasExtensionSupport: hasBlockExtensionSupport,
			currentExtension: getBlockExtension(blockName),
			blockType: select('core/blocks').getBlockType(blockName),
		};
	});
}
