// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import {
	memo,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Tabs } from '@blockera/controls';
import { isEquals, isObject, cloneObject, mergeObject } from '@blockera/utils';
import { getItem, setItem, updateItem, freshItem } from '@blockera/storage';

/**
 * Internal dependencies
 */
import type { Props } from './types';
import { STORE_NAME } from '../base/store/constants';
import { resetExtensionSettings } from '../../utils';
import { isInnerBlock } from '../../components/utils';
import { MappedExtensions } from './mapped-extensions';
import { useDisplayBlockControls } from '../../../hooks';
import { getNormalizedCacheVersion } from '../../helpers';
import StateContainer from '../../components/state-container';

const cacheKeyPrefix = 'BLOCKERA_EDITOR_SUPPORTS';

// Function to remove 'label' property from each extension's config item
// Memoized cache for extensionsWithoutLabel results
const _extensionsWithoutLabelCache = new WeakMap<Object, Object>();

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

const getTabs = (insideBlockInspector: boolean): Array<Object> => {
	return [
		...(insideBlockInspector
			? [
					{
						name: 'settings',
						title: __('General', 'blockera'),
						tooltip: __('General Block Settings', 'blockera'),
						className: 'settings-tab',
						icon: <Icon icon="gear" iconSize="20" />,
					},
			  ]
			: []),
		{
			name: 'style',
			title: __('Styles', 'blockera'),
			tooltip: __('Block Design & Style Settings', 'blockera'),
			className: 'style-tab',
			icon: <Icon library="wp" icon="styles" iconSize="20" />,
		},
		{
			name: 'interactions',
			title: __('Animations', 'blockera'),
			tooltip: __('Block Interactions and Animations', 'blockera'),
			className: 'interactions-tab',
			icon: <Icon icon="animations" iconSize="20" />,
		},
	];
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
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
		controllerProps: {
			currentTab,
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
			handleOnChangeAttributes,
		},
		...props
	}: Props): MixedElement => {
		const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
			useState(false);
		useEffect(() => {
			// When component unmount!
			return () => {
				resetExtensionSettings();
			};
			// eslint-disable-next-line
		}, []);

		props = {
			...props,
			currentState,
			setAttributes,
			currentBreakpoint,
			handleOnChangeAttributes,
		};

		const { version } = select('blockera/data').getEntity('blockera');
		const parentClientIds = select('core/block-editor').getBlockParents(
			props.clientId
		);

		const directParentBlock =
			parentClientIds?.length > 0
				? select('core/block-editor').getBlock(
						parentClientIds[parentClientIds.length - 1]
				  )
				: {};

		const { updateExtension } = useDispatch(STORE_NAME);
		const { getExtensions } = select(STORE_NAME);
		const cacheKey =
			cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);
		let extensions = getExtensions(props.name);
		const { getBlockType } = select('core/blocks');
		const blockType = getBlockType(props.name);
		extensions = mergeObject(
			extensions,
			blockType.supports?.blockExtensions || {}
		);
		const _extensionsWithoutLabel = extensionsWithoutLabel(
			cloneObject(extensions)
		);
		const cacheData = useMemo(() => {
			let localCache = getItem(cacheKey) || {};

			if (!localCache) {
				localCache = freshItem(cacheKey, cacheKeyPrefix);
			}

			let { [props.name]: cache = {} } = localCache || {};

			// If cache data doesn't equal extensions, update cache
			// Compare cache and _extensionsWithoutLabel, ignoring specific properties
			const omitProps = ['status', 'label', 'show', 'force', 'config'];

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

			const cacheOmitted = omitDeep(cache, omitProps);
			const extensionsOmitted = omitDeep(
				_extensionsWithoutLabel,
				omitProps
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
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [cacheKey, extensions]);
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

			if (isEquals(supports, settings)) {
				return;
			}

			setSettings(supports);
			updateItem(
				cacheKey,
				mergeObject(cacheData, {
					[props.name]: extensionsWithoutLabel(cloneObject(supports)),
				})
			);
			// eslint-disable-next-line
		}, [currentBlock]);

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
			}),
			[
				currentBlock,
				currentState,
				currentBreakpoint,
				currentInnerBlockState,
				props.name,
				props.supports,
				props.clientId,
			]
		);

		const Panel = (tab: Object) => (
			<MappedExtensions
				directParentBlock={directParentBlock}
				tab={tab}
				props={props}
				block={block}
				settings={settings}
				attributes={attributes}
				additional={additional}
				currentStateAttributes={currentStateAttributes}
				handleOnChangeSettings={handleOnChangeSettings}
				handleOnChangeAttributes={handleOnChangeAttributes}
				currentBlock={currentBlock}
				currentState={currentState}
				currentInnerBlockState={currentInnerBlockState}
				isReportingErrorCompleted={isReportingErrorCompleted}
				setIsReportingErrorCompleted={setIsReportingErrorCompleted}
			/>
		);

		const displayBlockControls = useDisplayBlockControls();

		return (
			<StateContainer
				name={props.name}
				clientId={props.clientId}
				insideBlockInspector={insideBlockInspector}
				availableStates={availableStates}
				blockeraUnsavedData={blockAttributes?.blockeraUnsavedData}
			>
				{displayBlockControls && insideBlockInspector && (
					<Tabs
						design="modern"
						orientation="horizontal"
						tabs={getTabs(insideBlockInspector)}
						activeTab={currentTab}
						setCurrentTab={setCurrentTab}
						className="block-inspector-tabs"
						getPanel={Panel}
					/>
				)}
				{!displayBlockControls && !insideBlockInspector && (
					<Tabs
						design="modern"
						orientation="horizontal"
						tabs={getTabs(insideBlockInspector)}
						activeTab={currentTab}
						setCurrentTab={setCurrentTab}
						className="block-inspector-tabs"
						getPanel={Panel}
					/>
				)}
				{children}
			</StateContainer>
		);
	}
	// FIXME: we should double check this to fix re-rendering problems.
	// propsAreEqual
);
