// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from './global-styles-provider';
import { getValueFromObjectPath, setImmutably } from './utils';

export const useBackButton = ({
	screenElement,
	setSelectedBlockRef,
	setSelectedBlockStyle,
	setSelectedBlockStyleVariation,
}: {
	screenElement: HTMLElement,
	setSelectedBlockRef: (blockRef: string) => void,
	setSelectedBlockStyle: (blockName: string) => void,
	setSelectedBlockStyleVariation: (blockName: string) => void,
}) => {
	const backButton = screenElement.querySelector('div');

	if (backButton) {
		const h2 = backButton.querySelector('h2');
		h2.innerText = __('Blocks', 'blockera');
		backButton.style.display = 'block';

		backButton?.addEventListener('click', () => {
			setSelectedBlockRef(undefined);
			setSelectedBlockStyle(undefined);
			setSelectedBlockStyleVariation(undefined);
		});
	}
};

export function useGlobalSetting(propertyPath, blockName, source = 'all') {
	const { setUserConfig, ...configs } = useGlobalStylesContext();
	const appendedBlockPath = blockName ? '.blocks.' + blockName : '';
	const appendedPropertyPath = propertyPath ? '.' + propertyPath : '';
	const contextualPath = `settings${appendedBlockPath}${appendedPropertyPath}`;
	const globalPath = `settings${appendedPropertyPath}`;
	const sourceKey = source === 'all' ? 'merged' : source;

	const settingValue = useMemo(() => {
		const configToUse = configs[sourceKey];
		if (!configToUse) {
			throw 'Unsupported source';
		}

		if (propertyPath) {
			return (
				getValueFromObjectPath(configToUse, contextualPath) ??
				getValueFromObjectPath(configToUse, globalPath)
			);
		}

		let result = {};

		console.log(configToUse);

		VALID_SETTINGS.forEach((setting) => {
			const value =
				getValueFromObjectPath(
					configToUse,
					`settings${appendedBlockPath}.${setting}`
				) ?? getValueFromObjectPath(configToUse, `settings.${setting}`);
			if (value !== undefined) {
				result = setImmutably(result, setting.split('.'), value);
			}
		});
		return result;
	}, [
		configs,
		sourceKey,
		globalPath,
		propertyPath,
		contextualPath,
		appendedBlockPath,
	]);

	const setSetting = (newValue) => {
		setUserConfig((currentConfig) =>
			setImmutably(currentConfig, contextualPath.split('.'), newValue)
		);
	};
	return [settingValue, setSetting];
}

/**
 * Use global style.
 *
 * @param {string} path - The path.
 * @param {string} blockName - The block name.
 * @param {string} source - The source.
 * @param {Object} options - The options.
 * @return {Array} The global style.
 */
export function useGlobalStyle(
	path: string,
	blockName: string,
	source: string = 'all',
	{ shouldDecodeEncode = true }: { shouldDecodeEncode: boolean } = {}
): [any, (newValue: any) => void] {
	const {
		merged: mergedConfig,
		base: baseConfig,
		user: userConfig,
		setUserConfig,
	} = useGlobalStylesContext();

	const appendedPath = path ? '.' + path : '';
	const finalPath = !blockName
		? `styles${appendedPath}`
		: `styles.blocks.${blockName}${appendedPath}`;

	const setStyle = (newValue) => {
		setUserConfig((currentConfig) =>
			setImmutably(
				currentConfig,
				finalPath.split('.'),
				shouldDecodeEncode
					? getPresetVariableFromValue(
							mergedConfig.settings,
							blockName,
							path,
							newValue
					  )
					: newValue
			)
		);
	};

	let rawResult, result;
	switch (source) {
		case 'all':
			rawResult = getValueFromObjectPath(mergedConfig, finalPath);
			result = shouldDecodeEncode
				? getValueFromVariable(mergedConfig, blockName, rawResult)
				: rawResult;
			break;
		case 'user':
			rawResult = getValueFromObjectPath(userConfig, finalPath);
			result = shouldDecodeEncode
				? getValueFromVariable(mergedConfig, blockName, rawResult)
				: rawResult;
			break;
		case 'base':
			rawResult = getValueFromObjectPath(baseConfig, finalPath);
			result = shouldDecodeEncode
				? getValueFromVariable(baseConfig, blockName, rawResult)
				: rawResult;
			break;
		default:
			throw 'Unsupported source';
	}

	return [result, setStyle];
}
