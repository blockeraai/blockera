/**
 * External dependencies
 */
import { useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit, setImmutably } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from './global-styles-provider';
import {
	getValueFromObjectPath,
	getValueFromVariable,
} from '../theme-json-utils';

export function useGlobalSetting(
	propertyPath: string,
	blockName: string,
	source = 'all'
): [unknown, (newValue: unknown) => void] {
	const { setUserConfig, ...configs } = useGlobalStylesContext();
	const appendedBlockPath = blockName ? '.blocks.' + blockName : '';
	const appendedPropertyPath = propertyPath ? '.' + propertyPath : '';
	const contextualPath = `settings${appendedBlockPath}${appendedPropertyPath}`;
	const globalPath = `settings${appendedPropertyPath}`;
	const sourceKey = source === 'all' ? 'merged' : source;

	const settingValue = useMemo(() => {
		const configToUse = configs[sourceKey] as
			Record<string, unknown> | undefined;
		if (!configToUse) {
			throw 'Unsupported source';
		}

		if (propertyPath) {
			return (
				getValueFromObjectPath(configToUse, contextualPath) ??
				getValueFromObjectPath(configToUse, globalPath)
			);
		}

		return (
			getValueFromObjectPath(configToUse, contextualPath) ??
			getValueFromObjectPath(configToUse, 'settings') ??
			{}
		);
	}, [configs, sourceKey, globalPath, propertyPath, contextualPath]);

	const setSetting = (newValue: unknown): void => {
		setUserConfig((currentConfig: Record<string, unknown>) =>
			setImmutably(currentConfig, contextualPath.split('.'), newValue)
		);
	};
	return [settingValue, setSetting];
}

export function useGlobalStyle(
	path: string,
	blockName: string,
	source = 'all',
	{
		shouldDecodeEncode = true,
		defaultStylesValue = {},
	}: {
		shouldDecodeEncode?: boolean;
		defaultStylesValue?: Record<string, unknown>;
	} = {}
): [
	Record<string, unknown>,
	Record<string, unknown>,
	(newValue: unknown) => void,
	Record<string, unknown>,
	Record<string, unknown>,
] {
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
		(newValue: unknown) => {
			setUserConfig((currentConfig: Record<string, unknown>) =>
				setImmutably(currentConfig, finalPath.split('.'), newValue)
			);
		},
		[finalPath, setUserConfig]
	);

	const { style, blockRootStyleWithoutVariation } = useMemo(() => {
		let rawResult: unknown;
		let result: unknown;
		switch (source) {
			case 'all':
				rawResult = getValueFromObjectPath(
					mergedConfig as Record<string, unknown>,
					finalPath
				);
				result = shouldDecodeEncode
					? getValueFromVariable(
							mergedConfig as Record<string, unknown>,
							blockName,
							rawResult as string | Record<string, unknown>
						)
					: rawResult;
				break;
			case 'user':
				rawResult = getValueFromObjectPath(
					userConfig as Record<string, unknown>,
					finalPath
				);
				result = shouldDecodeEncode
					? getValueFromVariable(
							mergedConfig as Record<string, unknown>,
							blockName,
							rawResult as string | Record<string, unknown>
						)
					: rawResult;
				break;
			case 'base':
				rawResult = getValueFromObjectPath(
					baseConfig as Record<string, unknown>,
					finalPath
				);
				result = shouldDecodeEncode
					? getValueFromVariable(
							baseConfig as Record<string, unknown>,
							blockName,
							rawResult as string | Record<string, unknown>
						)
					: rawResult;
				break;
			default:
				throw 'Unsupported source';
		}

		let blockRoot: Record<string, unknown> = {};

		if (blockName) {
			rawResult = getValueFromObjectPath(
				mergedConfig as Record<string, unknown>,
				finalPath.replace(appendedPath, '')
			);
			blockRoot = omit(
				shouldDecodeEncode
					? (getValueFromVariable(
							mergedConfig as Record<string, unknown>,
							blockName,
							rawResult as string | Record<string, unknown>
						) as Record<string, unknown>) || {}
					: (rawResult as Record<string, unknown>) || {},
				['variations']
			) as Record<string, unknown>;
		}

		return {
			style: {
				...defaultStylesValue,
				...(typeof result === 'string'
					? {}
					: (result as Record<string, unknown>)),
			},
			blockRootStyleWithoutVariation: blockRoot,
		};
	}, [
		source,
		finalPath,
		blockName,
		baseConfig,
		userConfig,
		appendedPath,
		mergedConfig,
		defaultStylesValue,
		shouldDecodeEncode,
	]);

	return [
		style,
		blockRootStyleWithoutVariation,
		setStyle,
		userConfig as Record<string, unknown>,
		baseConfig as Record<string, unknown>,
	];
}
