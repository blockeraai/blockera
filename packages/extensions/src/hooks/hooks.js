/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useBlockEditContext } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
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
			const addClassName = (className) => {
				if (!className) {
					return newProp;
				}
				if (-1 === className?.indexOf(newProp)) {
					return `${className} ${newProp}`;
				}

				return className;
			};

			defaultProps = {
				...(defaultProps || {}),
				className: addClassName(defaultProps?.className),
			};

			continue;
		}

		if (!defaultProps[key]) {
			defaultProps[key] = newProp;

			continue;
		}

		defaultProps = {
			...(defaultProps || {}),
			[key]: {
				...(defaultProps[key] ?? {}),
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
