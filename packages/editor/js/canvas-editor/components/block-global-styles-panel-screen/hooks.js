// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from './global-styles-provider';
import { getValueFromObjectPath, setImmutably } from './utils';

export const useBackButton = ({
	selectedBlockStyle,
	setSelectedBlockRef,
	setSelectedBlockStyle,
	setSelectedBlockStyleVariation,
}: {
	selectedBlockStyle: string,
	setSelectedBlockRef: (blockRef: string) => void,
	setSelectedBlockStyle: (blockName: string) => void,
	setSelectedBlockStyleVariation: (blockName: string) => void,
}) => {
	const backElement = document.querySelector('.components-heading');

	if (!backElement) {
		return;
	}

	if (backElement && selectedBlockStyle) {
		backElement.innerText = __('Blocks', 'blockera');
		const parent =
			backElement?.parentElement?.parentElement?.parentElement
				?.parentElement?.parentElement;

		// $FlowFixMe
		if (parent && parent?.style) {
			// $FlowFixMe
			parent.style.display = 'block';
		}

		backElement?.parentElement?.parentElement
			?.querySelector('button')
			?.addEventListener('click', () => {
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
	{
		shouldDecodeEncode = true,
		defaultStylesValue = {},
	}: { shouldDecodeEncode: boolean, defaultStylesValue: Object }
): [any, any, (newValue: any) => void] {
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

	const setStyle = useCallback(
		(newValue) => {
			setUserConfig((currentConfig) =>
				setImmutably(
					currentConfig,
					finalPath.split('.'),
					newValue
					// shouldDecodeEncode
					// 	? getPresetVariableFromValue(
					// 			mergedConfig.settings,
					// 			blockName,
					// 			path,
					// 			newValue
					// 	  )
					// 	: newValue
				)
			);
		},
		[
			finalPath,
			// shouldDecodeEncode,
			// mergedConfig,
			// blockName,
			// path,
			setUserConfig,
		]
	);

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

	let blockRootStyleWithoutVariation = {};

	if (blockName) {
		rawResult = getValueFromObjectPath(
			mergedConfig,
			finalPath.replace(appendedPath, '')
		);
		blockRootStyleWithoutVariation = omit(
			shouldDecodeEncode
				? getValueFromVariable(mergedConfig, blockName, rawResult) || {}
				: rawResult || {},
			['variations']
		);
	}

	return [
		useMemo(
			() => ({ ...defaultStylesValue, ...result }),
			[result, defaultStylesValue]
		),
		blockRootStyleWithoutVariation,
		setStyle,
	];
}
