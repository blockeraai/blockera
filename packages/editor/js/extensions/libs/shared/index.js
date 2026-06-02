// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { select, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import { doAction } from '@wordpress/hooks';
import {
	useMemo,
	useState,
	useEffect,
	useCallback,
	useRef,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Tabs } from '@blockera/controls';
import { getItem, setItem, updateItem, freshItem } from '@blockera/storage';
import { isEquals, isObject, cloneObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { Props } from './types';
import { registerBlockExtensionsSupports } from '../base';
import { STORE_NAME as EXTENSIONS_CONFIG_STORE_NAME } from '../base/store/constants';
import { STORE_NAME as BLOCK_EXTENSIONS_STORE_NAME } from '../../store/constants';
import { resetExtensionSettings } from '../../utils';
import { isInnerBlock } from '../../components/utils';
import { MappedExtensions } from './mapped-extensions';
import { getNormalizedCacheVersion } from '../../helpers';
import StateContainer from '../../components/state-container';
import { filterSettingsBySearch } from '../base/utils/search-features';
import { useFeatureSearch } from '../../components/feature-search-context';
import { useGlobalStylesPanelContext } from '../../../editor/global-styles/panel/context';
import { getBlockInspectorGroup } from '../../../hooks/use-block-side-effects/utils';

const INSPECTOR_UI_CONTEXT = 'block-inspector';
const GLOBAL_STYLES_UI_CONTEXT = 'global-styles';
const cacheKeyPrefix = 'BLOCKERA_EDITOR_SUPPORTS';

/** Properties ignored when comparing extension supports to persisted cache. */
const EXTENSIONS_CACHE_OMIT_PROPS = [
	'status',
	'label',
	'show',
	'force',
	'config',
];

const omitDeep = (obj: Object, props: Array<string>): Object => {
	if (Array.isArray(obj)) {
		return obj.map((item) => omitDeep(item, props));
	}
	if (obj && typeof obj === 'object') {
		const newObj: Object = {};
		for (const key in obj) {
			if (!props.includes(key)) {
				newObj[key] = omitDeep(obj[key], props);
			}
		}
		return newObj;
	}
	return obj;
};

// Function to remove 'label' property from each extension's config item
// Memoized cache for extensionsWithoutLabel results (reset when extensions change).
let _extensionsWithoutLabelCache: WeakMap<Object, Object> = new WeakMap();

/**
 * Clears in-memory extensions-without-label memoization.
 * Call when the extensions constant changes (e.g. variation-surface gating).
 */
export const clearExtensionsWithoutLabelCache = (): void => {
	_extensionsWithoutLabelCache = new WeakMap();
};

/**
 * Removes 'label' property from each extension's config item.
 * Uses memoization to improve performance and cache results.
 */
const extensionsWithoutLabel = (extensionsObj: Object): Object => {
	if (!extensionsObj || typeof extensionsObj !== 'object') {
		return extensionsObj;
	}
	// Use cache if available.
	if (_extensionsWithoutLabelCache.has(extensionsObj)) {
		return _extensionsWithoutLabelCache.get(extensionsObj);
	}

	const newExtensions: { [key: string]: Object } = {};

	for (const key in extensionsObj) {
		if (
			typeof extensionsObj[key] !== 'object' ||
			null === extensionsObj[key]
		) {
			newExtensions[key] = extensionsObj[key];
			continue;
		}

		const extension = extensionsObj[key];

		// Copy extension to newExtensions.
		newExtensions[key] = extension;

		for (const _key in extension) {
			if (extension[_key] && typeof extension[_key] === 'object') {
				const { label, ...rest } = extension[_key];

				newExtensions[key][_key] = rest;

				continue;
			}

			newExtensions[key][_key] = extension[_key];
		}
	}

	// Store in cache.
	_extensionsWithoutLabelCache.set(extensionsObj, newExtensions);

	return newExtensions;
};

const getExtensionsUiContext = (
	insideBlockInspector: boolean,
	variationSurface?: string
): string => {
	if (insideBlockInspector) {
		return INSPECTOR_UI_CONTEXT;
	}

	return `${GLOBAL_STYLES_UI_CONTEXT}-${variationSurface || 'style'}`;
};

const registerDefaultBlockExtensionsSupports = (
	blockName: string,
	blockExtension?: Object
): Object => {
	if ('function' === typeof blockExtension?.registerExtensions) {
		blockExtension.registerExtensions(blockName);
	} else {
		registerBlockExtensionsSupports(blockName);
	}

	return select(EXTENSIONS_CONFIG_STORE_NAME).getExtensions(blockName);
};

const registerBlockExtensionsSupportsForUiContext = ({
	blockName,
	blockExtension,
	variationSurface,
}: {
	blockName: string,
	blockExtension?: Object,
	variationSurface?: 'size' | 'style',
}): void => {
	const supportsExtensions =
		'function' === typeof blockExtension?.supportsExtensions
			? blockExtension.supportsExtensions
			: null;

	registerDefaultBlockExtensionsSupports(blockName, blockExtension);

	if (!supportsExtensions) {
		return;
	}

	const baseExtensions = select(EXTENSIONS_CONFIG_STORE_NAME).getExtensions(
		blockName
	);

	registerBlockExtensionsSupports(
		blockName,
		supportsExtensions(
			blockName,
			baseExtensions,
			variationSurface || 'style'
		)
	);
};

const getTabs = (
	insideBlockInspector: boolean,
	currentBlock: string
): Array<Object> => {
	return [
		...(!isInnerBlock(currentBlock) && insideBlockInspector
			? [
					{
						name: 'setting',
						title: __('General', 'blockera'),
						className: 'settings-tab',
					},
				]
			: []),
		{
			name: 'styles',
			title: __('Styles', 'blockera'),
			className: 'style-tab',
		},
	];
};

export const SharedBlockExtension: ComponentType<Props> = ({
	children,
	additional,
	setCurrentTab,
	insideBlockInspector,
	attributes: blockAttributes,
	defaultAttributes: attributes,
	setAttributes,
	availableStates,
	currentStateAttributes,
	currentAttributes: currentBlockAttributes,
	currentTab,
	currentBlock,
	currentState,
	currentBreakpoint,
	currentInnerBlockState,
	handleOnChangeAttributes,
	...props
}: Props): MixedElement | Array<MixedElement> => {
	const { currentBlockStyleVariation, variationSurface } =
		useGlobalStylesPanelContext();
	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);
	useEffect(() => {
		// When component unmount!
		return () => {
			resetExtensionSettings();
		};
	}, []);

	const { version } = select('blockera/data').getEntity('blockera');

	const { updateExtension } = useDispatch(EXTENSIONS_CONFIG_STORE_NAME);
	const { getExtensions } = select(EXTENSIONS_CONFIG_STORE_NAME);
	const { getBlockExtensionBy } = select(BLOCK_EXTENSIONS_STORE_NAME) || {};
	const blockExtension = getBlockExtensionBy('targetBlock', props.name);
	const extensionsUiContext = getExtensionsUiContext(
		insideBlockInspector,
		variationSurface
	);
	const [, setExtensionsConfigRevision] = useState(0);
	const cacheKey = [
		cacheKeyPrefix,
		getNormalizedCacheVersion(version),
		extensionsUiContext,
	].join('_');

	useEffect(() => {
		registerBlockExtensionsSupportsForUiContext({
			blockName: props.name,
			blockExtension,
			variationSurface,
		});

		clearExtensionsWithoutLabelCache();
		setExtensionsConfigRevision((revision) => revision + 1);
	}, [blockExtension, props.name, variationSurface, extensionsUiContext]);

	let extensions = getExtensions(props.name);
	const { getBlockType } = select('core/blocks');
	const blockType = getBlockType(props.name);
	extensions = useMemo(
		() =>
			mergeObject(extensions, blockType.supports?.blockExtensions || {}),
		[extensions, blockType.supports?.blockExtensions]
	);

	const previousExtensionsRef = useRef<?Object>(null);

	const _extensionsWithoutLabel = useMemo(() => {
		if (
			null !== previousExtensionsRef.current &&
			!isEquals(previousExtensionsRef.current, extensions)
		) {
			clearExtensionsWithoutLabelCache();
		}

		previousExtensionsRef.current = extensions;

		return extensionsWithoutLabel(cloneObject(extensions));
	}, [extensions]);

	const cacheData = useMemo(() => {
		let localCache = getItem(cacheKey) || {};

		if (!localCache) {
			localCache = freshItem(cacheKey, cacheKeyPrefix);
		}

		let { [props.name]: cache = {} } = localCache || {};

		// If cache data doesn't equal extensions, update cache
		// Compare cache and _extensionsWithoutLabel, ignoring specific properties
		const cacheOmitted = omitDeep(cache, EXTENSIONS_CACHE_OMIT_PROPS);
		const extensionsOmitted = omitDeep(
			_extensionsWithoutLabel,
			EXTENSIONS_CACHE_OMIT_PROPS
		);

		if (!isEquals(cacheOmitted, extensionsOmitted)) {
			cache = _extensionsWithoutLabel;
			setItem(
				cacheKey,
				mergeObject(
					{
						...(getItem(cacheKey) || {}),
						[props.name]: cache,
					},
					{
						[props.name]: _extensionsWithoutLabel,
					}
				)
			);
		}

		return cache;
	}, [cacheKey, props.name, _extensionsWithoutLabel]);
	const supports = useMemo(() => {
		if (!cacheData) {
			setItem(
				cacheKey,
				mergeObject(cacheData, {
					[props.name]: _extensionsWithoutLabel,
				})
			);
			return extensions;
		}

		const mergedEntries = new Map<string, Object>();

		// First add all entries from cacheData.
		Object.entries(cacheData).forEach(([support, settings]) => {
			mergedEntries.set(
				support,
				Object.fromEntries(
					Object.entries(settings).map(([key, value]) => {
						if (
							null !== value &&
							isObject(value) &&
							value.hasOwnProperty('config') &&
							extensions[support]?.[key]?.config
						) {
							value.config = extensions[support][key].config;
						}
						return [key, value];
					})
				)
			);
		});

		// Add entries from extensions that don't exist in cacheData.
		Object.entries(extensions).forEach(([support, settings]) => {
			if (!mergedEntries.has(support)) {
				mergedEntries.set(support, settings);

				return;
			}

			// Check if internal items from settings exist in support
			Object.entries(settings).forEach(([key, value]) => {
				if (!mergedEntries.get(support)?.[key]) {
					mergedEntries.set(support, {
						...mergedEntries.get(support),
						[key]: value,
					});
				}
				if (
					'object' === typeof mergedEntries.get(support)?.[key] &&
					!mergedEntries.get(support)?.[key]?.label
				) {
					mergedEntries.set(support, {
						...mergedEntries.get(support),
						[key]: {
							...mergedEntries.get(support)?.[key],
							label: extensions[support][key].label,
						},
					});
				}
			});
		});

		return Object.fromEntries(mergedEntries);
		// eslint-disable-next-line
	}, [props.name, cacheData, extensions, _extensionsWithoutLabel]);

	const [settings, setSettings] = useState(supports);

	useEffect(() => {
		setSettings(supports);
	}, [supports]);

	const { searchQuery, activeSearchMode } = useFeatureSearch();
	// Filter settings based on search query
	const filteredSettings = useMemo(
		() => filterSettingsBySearch(cloneObject(settings), searchQuery),
		[settings, searchQuery]
	);

	// Get next settings after switch between blocks.
	useEffect(() => {
		if (!isInnerBlock(currentBlock)) {
			return;
		}
		doAction(
			'blockera.editor.extensions.sharedExtension.blockSupports.cacheData',
			cacheKey,
			props
		);
	}, [
		currentBlock,
		cacheData,
		cacheKey,
		props,
		supports,
		extensions,
		settings,
		updateExtension,
	]);

	const handleOnChangeSettings = useCallback(
		(newSupports: Object, name: string): void => {
			const newSettings = {
				...settings,
				[name]: {
					...settings[name],
					...newSupports,
				},
			};

			setSettings(newSettings);
			updateItem(
				cacheKey,
				mergeObject(cacheData, {
					[props.name]: newSettings,
				})
			);
			updateExtension({
				name,
				newSupports,
				blockName: props.name,
			});
		},
		[cacheKey, settings, props.name, cacheData, updateExtension]
	);

	const block = useMemo(
		() => ({
			currentBlock,
			currentState,
			currentBreakpoint,
			blockName: props.name,
			currentInnerBlockState,
			supports: props.supports,
			clientId: props.clientId,
			currentBlockStyleVariation,
		}),
		[
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
			props.name,
			props.supports,
			props.clientId,
			currentBlockStyleVariation,
		]
	);

	const Panel = (tab: Object) => (
		<MappedExtensions
			tab={tab}
			block={block}
			settings={filteredSettings}
			attributes={attributes}
			additional={additional}
			currentStateAttributes={currentStateAttributes}
			handleOnChangeSettings={handleOnChangeSettings}
			handleOnChangeAttributes={handleOnChangeAttributes}
			currentBlock={currentBlock}
			currentState={currentState}
			currentBreakpoint={currentBreakpoint}
			currentInnerBlockState={currentInnerBlockState}
			isReportingErrorCompleted={isReportingErrorCompleted}
			setIsReportingErrorCompleted={setIsReportingErrorCompleted}
			activeSearchMode={activeSearchMode}
		/>
	);

	const tabs = getTabs(insideBlockInspector, currentBlock);
	const isInnerBlockTarget = isInnerBlock(currentBlock);
	const stylesTab =
		tabs.find((tab) => 'styles' === tab.name) || tabs[0] || null;

	useEffect(() => {
		if (
			!isInnerBlockTarget ||
			!stylesTab ||
			currentTab === stylesTab.name
		) {
			return;
		}

		setCurrentTab(stylesTab.name);
	}, [currentTab, isInnerBlockTarget, setCurrentTab, stylesTab]);

	const shouldHideTabChrome = tabs.length <= 1 || isInnerBlockTarget;

	const renderTabsOrPanel = () => {
		if (shouldHideTabChrome) {
			return stylesTab ? Panel(stylesTab) : null;
		}

		return (
			<Tabs
				tabs={tabs}
				design="modern"
				getPanel={Panel}
				activeTab={currentTab}
				orientation="horizontal"
				setCurrentTab={setCurrentTab}
				className="block-inspector-tabs"
			/>
		);
	};

	if (insideBlockInspector) {
		const inspectorTabs =
			isInnerBlockTarget && stylesTab ? [stylesTab] : tabs;

		return inspectorTabs.map((tab) => (
			<InspectorControls
				key={tab.name}
				group={getBlockInspectorGroup(tab.name)}
			>
				<StateContainer
					name={props.name}
					clientId={props.clientId}
					insideBlockInspector={insideBlockInspector}
					availableStates={availableStates}
					blockeraUnsavedData={blockAttributes?.blockeraUnsavedData}
					variationSurface={variationSurface}
				>
					{Panel(tab)}
				</StateContainer>
			</InspectorControls>
		));
	}

	return (
		<StateContainer
			name={props.name}
			clientId={props.clientId}
			insideBlockInspector={insideBlockInspector}
			availableStates={availableStates}
			blockeraUnsavedData={blockAttributes?.blockeraUnsavedData}
			variationSurface={variationSurface}
		>
			{!insideBlockInspector && renderTabsOrPanel()}
			{children}
		</StateContainer>
	);
};
