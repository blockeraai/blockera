// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ErrorBoundary } from 'react-error-boundary';
import { select, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import {
	memo,
	useMemo,
	useState,
	Fragment,
	useEffect,
} from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Tabs, type TTabProps } from '@blockera/controls';
import { ExtensionSlotFill } from '@blockera/features-core';
import { isEquals, isObject, cloneObject, mergeObject } from '@blockera/utils';
import { getItem, setItem, updateItem, freshItem } from '@blockera/storage';
// import { useTraceUpdate } from '@blockera/editor';

const cacheKeyPrefix = 'BLOCKERA_EDITOR_SUPPORTS';

/**
 * Internal dependencies
 */
import { ErrorBoundaryFallback } from '../../hooks/block-settings';
import { BackgroundExtension } from '../background';
import { BorderAndShadowExtension } from '../border-and-shadow';
import { EffectsExtension } from '../effects';
import { TypographyExtension } from '../typography';
import { SpacingExtension } from '../spacing';
import { PositionExtension } from '../position';
import { SizeExtension } from '../size';
import { LayoutExtension } from '../layout';
import { FlexChildExtension } from '../flex-child';
import { CustomStyleExtension } from '../custom-style';
import { MouseExtension } from '../mouse';
import { StateOptionsExtension } from '../block-card/block-states/extension';
// import { EntranceAnimationExtension } from '../entrance-animation';
// import { ScrollAnimationExtension } from '../scroll-animation';
import { ClickAnimationExtension } from '../click-animation';
// import { ConditionsExtension } from '../conditions';
import { AdvancedSettingsExtension } from '../advanced-settings';
import {
	isInnerBlock,
	// FIXME: we are double check this to fix re-rendering problems.
	// propsAreEqual
} from '../../components/utils';
import { useBlockSection } from '../../components';
import StateContainer from '../../components/state-container';
import { STORE_NAME } from '../base/store/constants';
import type {
	InnerBlocks,
	InnerBlockType,
} from '../block-card/inner-blocks/types';
import type { THandleOnChangeAttributes } from '../types';
import { resetExtensionSettings } from '../../utils';
import { useDisplayBlockControls } from '../../../hooks';
import type {
	StateTypes,
	TBreakpoint,
	TStates,
} from '../block-card/block-states/types';
import { useBlockContext } from '../../hooks';
import bootstrapScripts from '../../scripts';
import { getNormalizedCacheVersion } from '../../helpers';

type Props = {
	name: string,
	clientId: string,
	supports: Object,
	additional: Object,
	attributes: Object,
	currentAttributes: Object,
	defaultAttributes: Object,
	controllerProps: {
		currentTab: string,
		currentState: TStates,
		blockeraInnerBlocks: Object,
		currentBreakpoint: TBreakpoint,
		currentInnerBlockState: TStates,
		currentBlock: 'master' | InnerBlockType,
		handleOnChangeAttributes: THandleOnChangeAttributes,
	},
	children?: ComponentType<any>,
	currentStateAttributes: Object,
	blockeraInnerBlocks: InnerBlocks,
	setAttributes: (attributes: Object) => void,
	availableStates: { [key: TStates | string]: StateTypes },
};

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

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
		additional,
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

		const { setCurrentTab } = useBlockContext();

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

		const directParentBlock = select('core/block-editor').getBlock(
			parentClientIds[parentClientIds.length - 1]
		);

		const { updateExtension } = useDispatch(STORE_NAME);
		const { getExtensions } = select(STORE_NAME);
		const cacheKey =
			cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);
		const extensions = getExtensions(props.name);
		const _extensionsWithoutLabel = extensionsWithoutLabel(
			cloneObject(extensions)
		);
		const cacheData = useMemo(() => {
			let { [props.name]: cache = {} } = getItem(cacheKey) || {};

			if (!cache) {
				cache = freshItem(cacheKey, cacheKeyPrefix)?.[props.name];
			}

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
					mergeObject(cache, {
						[props.name]: _extensionsWithoutLabel,
					})
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

		// On mounting shared extension component, we can bootstrap scripts.
		useEffect(() => {
			bootstrapScripts();
			// eslint-disable-next-line
		}, []);

		// Get next settings after switch between blocks.
		useEffect(() => {
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

		const handleOnChangeSettings = (
			newSupports: Object,
			name: string
		): void => {
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
		};

		const {
			mouseConfig,
			sizeConfig,
			layoutConfig,
			statesConfig,
			spacingConfig,
			effectsConfig,
			positionConfig,
			flexChildConfig,
			backgroundConfig,
			typographyConfig,
			customStyleConfig,
			borderAndShadowConfig,
			// entranceAnimationConfig,
			// scrollAnimationConfig,
			clickAnimationConfig,
			// conditionsConfig,
			advancedSettingsConfig,
		} = settings;

		const block = {
			currentBlock,
			currentState,
			currentBreakpoint,
			blockName: props.name,
			currentInnerBlockState,
			supports: props.supports,
			clientId: props.clientId,
		};

		const MappedExtensions = (tab: TTabProps): Array<MixedElement> => {
			const activePanel = [];

			switch (tab.name) {
				case 'settings':
					activePanel.push(
						<Fragment key={`${props.clientId}-settings-panel`}>
							<SlotFillProvider>
								<Slot
									name={'blockera-inspector-settings-start'}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-settings-start',
									}}
								/>
							</SlotFillProvider>

							{/* <ErrorBoundary
								fallbackRender={({ error }): MixedElement => (
												<ErrorBoundaryFallback
													isReportingErrorCompleted={isReportingErrorCompleted}
													clientId={props.clientId}
													setIsReportingErrorCompleted={
														setIsReportingErrorCompleted
													}
													from={'extension'}
													configId={'extensionConfig'}
													title={__(
														'Conditions',
														'blockera'
													)}
													icon={
														<Icon icon="extension-conditions" />
													}
													error={error}
												/>
										  )}
							>
								<ConditionsExtension
									block={block}
									extensionConfig={conditionsConfig}
									extensionProps={{}}
									values={{}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary> */}
							<SlotFillProvider>
								<Slot name={'blockera-inspector-settings'} />
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName: 'blockera-inspector-settings',
									}}
								/>
							</SlotFillProvider>
							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										configId={'advancedSettingsConfig'}
										title={__('Advanced', 'blockera')}
										icon={
											<Icon icon="extension-advanced" />
										}
										error={error}
									/>
								)}
							>
								<AdvancedSettingsExtension
									block={block}
									extensionConfig={advancedSettingsConfig}
									values={{
										blockeraAttributes:
											currentStateAttributes.blockeraAttributes,
									}}
									attributes={{
										blockeraAttributes:
											attributes.blockeraAttributes,
									}}
									extensionProps={{
										blockeraAttributes: {
											attributeElement: '',
										},
									}}
									setSettings={handleOnChangeSettings}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary>
							<SlotFillProvider>
								<Slot
									name={'blockera-inspector-settings-end'}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-settings-end',
									}}
								/>
							</SlotFillProvider>
						</Fragment>
					);
					break;

				case 'style':
					activePanel.push(
						<Fragment key={`${props.clientId}-style-panel`}>
							<SlotFillProvider>
								<Slot
									name={'blockera-inspector-styles-start'}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-styles-start',
									}}
								/>
							</SlotFillProvider>
							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'statesConfig'}
										title={__(
											'Block State Options',
											'blockera'
										)}
										// icon={<Icon icon="extension-states" />}
									/>
								)}
							>
								<StateOptionsExtension
									block={block}
									extensionConfig={statesConfig}
									values={
										currentStateAttributes.blockeraBlockStates
									}
									attributes={{
										blockeraBlockStates:
											attributes.blockeraBlockStates,
									}}
									extensionProps={{}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
									currentBlock={currentBlock}
									currentState={
										isInnerBlock(currentBlock)
											? currentInnerBlockState
											: currentState
									}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'spacingConfig'}
										title={__('Spacing', 'blockera')}
										icon={
											<Icon icon={'extension-spacing'} />
										}
									/>
								)}
							>
								<SpacingExtension
									block={block}
									extensionConfig={spacingConfig}
									values={{
										blockeraSpacing:
											currentStateAttributes.blockeraSpacing,
									}}
									attributes={{
										blockeraSpacing:
											attributes.blockeraSpacing,
									}}
									extensionProps={{
										blockeraSpacing: {},
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary>
							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'typographyConfig'}
										title={__('Typography', 'blockera')}
										icon={
											<Icon icon="extension-typography" />
										}
									/>
								)}
							>
								<TypographyExtension
									block={block}
									extensionConfig={typographyConfig}
									extensionProps={{
										blockeraFontFamily: {},
										blockeraFontAppearance: {},
										blockeraFontColor: {},
										blockeraFontSize: {},
										blockeraLineHeight: {},
										blockeraTextAlign: {},
										blockeraTextDecoration: {},
										blockeraTextTransform: {},
										blockeraDirection: {},
										blockeraTextShadow: {},
										blockeraLetterSpacing: {},
										blockeraWordSpacing: {},
										blockeraTextIndent: {},
										blockeraTextOrientation: {},
										blockeraTextColumns: {},
										blockeraTextStroke: {},
										blockeraWordBreak: {},
										blockeraTextWrap: {},
									}}
									values={{
										blockeraFontFamily:
											currentStateAttributes?.blockeraFontFamily,
										blockeraFontAppearance:
											currentStateAttributes?.blockeraFontAppearance,
										blockeraFontColor:
											currentStateAttributes?.blockeraFontColor,
										blockeraFontSize:
											currentStateAttributes?.blockeraFontSize,
										blockeraLineHeight:
											currentStateAttributes?.blockeraLineHeight,
										blockeraTextAlign:
											currentStateAttributes?.blockeraTextAlign,
										blockeraTextDecoration:
											currentStateAttributes?.blockeraTextDecoration,
										blockeraTextTransform:
											currentStateAttributes?.blockeraTextTransform,
										blockeraDirection:
											currentStateAttributes?.blockeraDirection,
										blockeraTextShadow:
											currentStateAttributes?.blockeraTextShadow,
										blockeraLetterSpacing:
											currentStateAttributes?.blockeraLetterSpacing,
										blockeraWordSpacing:
											currentStateAttributes?.blockeraWordSpacing,
										blockeraTextIndent:
											currentStateAttributes?.blockeraTextIndent,
										blockeraTextOrientation:
											currentStateAttributes?.blockeraTextOrientation,
										blockeraTextColumns:
											currentStateAttributes?.blockeraTextColumns,
										blockeraTextStroke:
											currentStateAttributes?.blockeraTextStroke,
										blockeraWordBreak:
											currentStateAttributes?.blockeraWordBreak,
										blockeraTextWrap:
											currentStateAttributes?.blockeraTextWrap,
									}}
									attributes={{
										blockeraFontFamily:
											attributes?.blockeraFontFamily,
										blockeraFontAppearance:
											attributes?.blockeraFontAppearance,
										blockeraFontColor:
											attributes?.blockeraFontColor,
										blockeraFontSize:
											attributes?.blockeraFontSize,
										blockeraLineHeight:
											attributes?.blockeraLineHeight,
										blockeraTextAlign:
											attributes?.blockeraTextAlign,
										blockeraTextDecoration:
											attributes?.blockeraTextDecoration,
										blockeraTextTransform:
											attributes?.blockeraTextTransform,
										blockeraDirection:
											attributes?.blockeraDirection,
										blockeraTextShadow:
											attributes?.blockeraTextShadow,
										blockeraLetterSpacing:
											attributes?.blockeraLetterSpacing,
										blockeraWordSpacing:
											attributes?.blockeraWordSpacing,
										blockeraTextIndent:
											attributes?.blockeraTextIndent,
										blockeraTextOrientation:
											attributes?.blockeraTextOrientation,
										blockeraTextColumns:
											attributes?.blockeraTextColumns,
										blockeraTextStroke:
											attributes?.blockeraTextStroke,
										blockeraWordBreak:
											attributes?.blockeraWordBreak,
										blockeraTextWrap:
											attributes?.blockeraTextWrap,
									}}
									display={
										currentStateAttributes?.blockeraDisplay
									}
									backgroundClip={
										currentStateAttributes?.blockeraBackgroundClip
									}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										title={__('Background', 'blockera')}
										icon={
											<Icon icon="extension-background" />
										}
										configId={'backgroundConfig'}
										error={error}
									/>
								)}
							>
								<BackgroundExtension
									block={block}
									setSettings={handleOnChangeSettings}
									extensionConfig={backgroundConfig}
									extensionProps={{
										blockeraBackground: {},
										blockeraBackgroundColor: {},
										blockeraBackgroundClip: {},
									}}
									values={{
										blockeraBackground:
											currentStateAttributes?.blockeraBackground,
										blockeraBackgroundColor:
											currentStateAttributes?.blockeraBackgroundColor,
										blockeraBackgroundClip:
											currentStateAttributes?.blockeraBackgroundClip,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									attributes={{
										blockeraBackground:
											attributes.blockeraBackground,
										blockeraBackgroundColor:
											attributes.blockeraBackgroundColor,
										blockeraBackgroundClip:
											attributes.blockeraBackgroundClip,
									}}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'borderAndShadowConfig'}
										title={__(
											'Border And Shadow',
											'blockera'
										)}
										icon={<Icon icon="extension-border" />}
									/>
								)}
							>
								<BorderAndShadowExtension
									block={block}
									extensionConfig={borderAndShadowConfig}
									extensionProps={{
										blockeraBorder: {},
										blockeraBorderRadius: {},
										blockeraBoxShadow: {},
										blockeraOutline: {},
									}}
									values={{
										blockeraBorder:
											currentStateAttributes.blockeraBorder,
										blockeraBorderRadius:
											currentStateAttributes.blockeraBorderRadius,
										blockeraOutline:
											currentStateAttributes.blockeraOutline,
										blockeraBoxShadow:
											currentStateAttributes.blockeraBoxShadow,
									}}
									attributes={{
										blockeraBorder:
											attributes.blockeraBorder,
										blockeraBorderRadius:
											attributes.blockeraBorderRadius,
										blockeraOutline:
											attributes.blockeraOutline,
										blockeraBoxShadow:
											attributes.blockeraBoxShadow,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<SlotFillProvider>
								<Slot name={'blockera-inspector-styles'} />
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName: 'blockera-inspector-styles',
									}}
								/>
							</SlotFillProvider>

							{directParentBlock?.innerBlocks?.length > 0 &&
								directParentBlock?.attributes.blockeraDisplay
									?.value === 'flex' && (
									<ErrorBoundary
										fallbackRender={({ error }) => (
											<ErrorBoundaryFallback
												isReportingErrorCompleted={
													isReportingErrorCompleted
												}
												setIsReportingErrorCompleted={
													setIsReportingErrorCompleted
												}
												from={'extension'}
												error={error}
												configId={'flexChildConfig'}
												title={__(
													'Flex Child',
													'blockera'
												)}
												icon={
													<Icon icon="extension-flex-child" />
												}
											/>
										)}
									>
										<FlexChildExtension
											block={block}
											extensionConfig={flexChildConfig}
											values={{
												blockeraFlexChildAlign:
													currentStateAttributes.blockeraFlexChildAlign,
												blockeraFlexChildSizing:
													currentStateAttributes.blockeraFlexChildSizing,
												blockeraFlexChildGrow:
													currentStateAttributes.blockeraFlexChildGrow,
												blockeraFlexChildShrink:
													currentStateAttributes.blockeraFlexChildShrink,
												blockeraFlexChildBasis:
													currentStateAttributes.blockeraFlexChildBasis,
												blockeraFlexChildOrder:
													currentStateAttributes.blockeraFlexChildOrder,
												blockeraFlexChildOrderCustom:
													currentStateAttributes.blockeraFlexChildOrderCustom,
												blockeraFlexDirection:
													directParentBlock
														?.attributes
														?.blockeraFlexLayout
														?.value?.direction,
											}}
											attributes={{
												blockeraFlexChildSizing:
													attributes.blockeraFlexChildSizing,
												blockeraFlexChildGrow:
													attributes.blockeraFlexChildGrow,
												blockeraFlexChildShrink:
													attributes.blockeraFlexChildShrink,
												blockeraFlexChildBasis:
													attributes.blockeraFlexChildBasis,
												blockeraFlexChildAlign:
													attributes.blockeraFlexChildAlign,
												blockeraFlexChildOrder:
													attributes.blockeraFlexChildOrder,
												blockeraFlexChildOrderCustom:
													attributes.blockeraFlexChildOrderCustom,
											}}
											extensionProps={{
												blockeraFlexChildSizing: {},
												blockeraFlexChildGrow: {},
												blockeraFlexChildShrink: {},
												blockeraFlexChildBasis: {},
												blockeraFlexChildAlign: {},
												blockeraFlexChildOrder: {},
												blockeraFlexChildOrderCustom:
													{},
											}}
											handleOnChangeAttributes={
												handleOnChangeAttributes
											}
											setSettings={handleOnChangeSettings}
										/>
									</ErrorBoundary>
								)}

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'layoutConfig'}
										title={__('Layout', 'blockera')}
										icon={<Icon icon="extension-layout" />}
									/>
								)}
							>
								<LayoutExtension
									block={block}
									extensionConfig={layoutConfig}
									extensionProps={{
										blockeraDisplay: {},
										blockeraFlexLayout: {},
										blockeraGap: {},
										blockeraFlexWrap: {},
										blockeraAlignContent: {},
									}}
									values={{
										blockeraDisplay:
											currentStateAttributes.blockeraDisplay,
										blockeraFlexLayout:
											currentStateAttributes.blockeraFlexLayout,
										blockeraGap:
											currentStateAttributes.blockeraGap,
										blockeraFlexWrap:
											currentStateAttributes.blockeraFlexWrap,
										blockeraAlignContent:
											currentStateAttributes.blockeraAlignContent,
									}}
									attributes={{
										blockeraDisplay:
											attributes.blockeraDisplay,
										blockeraFlexLayout:
											attributes.blockeraFlexLayout,
										blockeraGap: attributes.blockeraGap,
										blockeraFlexWrap:
											attributes.blockeraFlexWrap,
										blockeraAlignContent:
											attributes.blockeraAlignContent,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'sizeConfig'}
										title={__('Size', 'blockera')}
										icon={<Icon icon="extension-size" />}
									/>
								)}
							>
								<SizeExtension
									block={block}
									extensionConfig={sizeConfig}
									values={{
										blockeraWidth:
											currentStateAttributes.blockeraWidth,
										blockeraMinWidth:
											currentStateAttributes.blockeraMinWidth,
										blockeraMaxWidth:
											currentStateAttributes.blockeraMaxWidth,
										blockeraHeight:
											currentStateAttributes.blockeraHeight,
										blockeraMinHeight:
											currentStateAttributes.blockeraMinHeight,
										blockeraMaxHeight:
											currentStateAttributes.blockeraMaxHeight,
										blockeraOverflow:
											currentStateAttributes.blockeraOverflow,
										blockeraRatio:
											currentStateAttributes.blockeraRatio,
										blockeraFit:
											currentStateAttributes.blockeraFit,
										blockeraFitPosition:
											currentStateAttributes.blockeraFitPosition,
										blockeraBoxSizing:
											currentStateAttributes.blockeraBoxSizing,
									}}
									attributes={{
										blockeraWidth: attributes.blockeraWidth,
										blockeraMinWidth:
											attributes.blockeraMinWidth,
										blockeraMaxWidth:
											attributes.blockeraMaxWidth,
										blockeraHeight:
											attributes.blockeraHeight,
										blockeraMinHeight:
											attributes.blockeraMinHeight,
										blockeraMaxHeight:
											attributes.blockeraMaxHeight,
										blockeraOverflow:
											attributes.blockeraOverflow,
										blockeraRatio: attributes.blockeraRatio,
										blockeraFit: attributes.blockeraFit,
										blockeraFitPosition:
											attributes.blockeraFitPosition,
										blockeraBoxSizing:
											attributes.blockeraBoxSizing,
									}}
									extensionProps={{
										blockeraWidth: {},
										blockeraHeight: {},
										blockeraMinWidth: {},
										blockeraMinHeight: {},
										blockeraMaxWidth: {},
										blockeraMaxHeight: {},
										blockeraOverflow: {},
										blockeraRatio: {},
										blockeraFit: {},
										blockeraFitPosition: {},
										blockeraBoxSizing: {},
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'positionConfig'}
										title={__('Position', 'blockera')}
										icon={
											<Icon icon="extension-position" />
										}
									/>
								)}
							>
								<PositionExtension
									block={block}
									extensionConfig={positionConfig}
									values={{
										blockeraPosition:
											currentStateAttributes.blockeraPosition,
										blockeraZIndex:
											currentStateAttributes.blockeraZIndex,
									}}
									attributes={{
										blockeraPosition:
											attributes.blockeraPosition,
										blockeraZIndex:
											attributes.blockeraZIndex,
									}}
									extensionProps={{
										blockeraPosition: {},
										blockeraZIndex: {},
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										error={error}
										from={'extension'}
										configId={'effectsConfig'}
										title={__('Effects', 'blockera')}
										icon={<Icon icon="extension-effects" />}
									/>
								)}
							>
								<EffectsExtension
									block={block}
									extensionConfig={effectsConfig}
									extensionProps={{
										blockeraOpacity: {},
										blockeraTransform: {},
										blockeraTransformSelfPerspective: {},
										blockeraTransformSelfOrigin: {},
										blockeraBackfaceVisibility: {},
										blockeraTransformChildPerspective: {},
										blockeraTransformChildOrigin: {},
										blockeraTransition: {},
										blockeraFilter: {},
										blockeraBackdropFilter: {},
										blockeraBlendMode: {},
										blockeraDivider: {},
										blockeraMask: {},
									}}
									values={{
										blockeraOpacity:
											currentStateAttributes.blockeraOpacity,
										blockeraTransform:
											currentStateAttributes.blockeraTransform,
										blockeraBackfaceVisibility:
											currentStateAttributes.blockeraBackfaceVisibility,
										blockeraTransformSelfPerspective:
											currentStateAttributes.blockeraTransformSelfPerspective,
										blockeraTransformSelfOrigin:
											currentStateAttributes.blockeraTransformSelfOrigin,
										blockeraTransformChildOrigin:
											currentStateAttributes.blockeraTransformChildOrigin,
										blockeraTransformChildPerspective:
											currentStateAttributes.blockeraTransformChildPerspective,
										blockeraTransition:
											currentStateAttributes.blockeraTransition,
										blockeraFilter:
											currentStateAttributes.blockeraFilter,
										blockeraBackdropFilter:
											currentStateAttributes.blockeraBackdropFilter,
										blockeraBlendMode:
											currentStateAttributes.blockeraBlendMode,
										blockeraDivider:
											currentStateAttributes.blockeraDivider,
										blockeraMask:
											currentStateAttributes.blockeraMask,
									}}
									attributes={{
										blockeraOpacity:
											attributes.blockeraOpacity,
										blockeraTransform:
											attributes.blockeraTransform,
										blockeraBackfaceVisibility:
											attributes.blockeraBackfaceVisibility,
										blockeraTransformSelfPerspective:
											attributes.blockeraTransformSelfPerspective,
										blockeraTransformSelfOrigin:
											attributes.blockeraTransformSelfOrigin,
										blockeraTransformChildOrigin:
											attributes.blockeraTransformChildOrigin,
										blockeraTransformChildPerspective:
											attributes.blockeraTransformChildPerspective,
										blockeraTransition:
											attributes.blockeraTransition,
										blockeraFilter:
											attributes.blockeraFilter,
										blockeraBackdropFilter:
											attributes.blockeraBackdropFilter,
										blockeraBlendMode:
											attributes.blockeraBlendMode,
										blockeraDivider:
											attributes.blockeraDivider,
										blockeraMask: attributes.blockeraMask,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'customStyleConfig'}
										title={__('Custom CSS', 'blockera')}
										icon={
											<Icon icon="extension-custom-style" />
										}
									/>
								)}
							>
								<CustomStyleExtension
									block={block}
									extensionConfig={customStyleConfig}
									extensionProps={{
										blockeraCustomCSS: {},
									}}
									values={{
										blockeraCustomCSS:
											currentStateAttributes.blockeraCustomCSS,
									}}
									attributes={{
										blockeraCustomCSS:
											attributes.blockeraCustomCSS,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>

							<SlotFillProvider>
								<Slot name={'blockera-inspector-styles-end'} />
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-interactions-start',
									}}
								/>
							</SlotFillProvider>
						</Fragment>
					);
					break;

				case 'interactions':
					activePanel.push(
						<Fragment key={`${props.clientId}-interactions-panel`}>
							<SlotFillProvider>
								<Slot
									name={
										'blockera-inspector-interactions-start'
									}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-interactions-start',
									}}
								/>
							</SlotFillProvider>
							{/* <ErrorBoundary
								fallbackRender={({ error }) => (
												<ErrorBoundaryFallback
													isReportingErrorCompleted={isReportingErrorCompleted}
													clientId={props.clientId}
													setIsReportingErrorCompleted={
														setIsReportingErrorCompleted
													}
													from={'extension'}
													error={error}
													configId={
														'entranceAnimationConfig'
													}
													title={__(
														'On Entrance',
														'blockera'
													)}
													icon={
														<Icon icon="extension-entrance-animation" />
													}
												/>
										  )}
							>
								<EntranceAnimationExtension
									block={block}
									extensionConfig={entranceAnimationConfig}
									extensionProps={{}}
									values={{}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary> */}

							{/* <ErrorBoundary
								fallbackRender={({ error }) => (
												<ErrorBoundaryFallback
													isReportingErrorCompleted={isReportingErrorCompleted}
													clientId={props.clientId}
													setIsReportingErrorCompleted={
														setIsReportingErrorCompleted
													}
													from={'extension'}
													error={error}
													configId={
														'scrollAnimationConfig'
													}
													title={__(
														'On Scroll',
														'blockera'
													)}
													icon={
														<Icon icon="extension-scroll-animation" />
													}
												/>
										  )}
							>
								<ScrollAnimationExtension
									block={block}
									extensionConfig={scrollAnimationConfig}
									extensionProps={{}}
									values={{}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary> */}

							<SlotFillProvider>
								<Slot
									name={'blockera-inspector-interactions'}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-interactions',
									}}
								/>
							</SlotFillProvider>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'clickAnimationConfig'}
										title={__('On Click', 'blockera')}
										icon={
											<Icon icon="extension-click-animation" />
										}
									/>
								)}
							>
								<ClickAnimationExtension
									block={block}
									extensionConfig={clickAnimationConfig}
									extensionProps={{}}
									values={{}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ErrorBoundary>

							<ErrorBoundary
								fallbackRender={({ error }) => (
									<ErrorBoundaryFallback
										isReportingErrorCompleted={
											isReportingErrorCompleted
										}
										clientId={props.clientId}
										setIsReportingErrorCompleted={
											setIsReportingErrorCompleted
										}
										from={'extension'}
										error={error}
										configId={'mouseConfig'}
										title={__('Mouse', 'blockera')}
										icon={<Icon icon="extension-mouse" />}
									/>
								)}
							>
								<MouseExtension
									block={block}
									mouseConfig={mouseConfig}
									extensionProps={{
										blockeraCursor: {},
										blockeraUserSelect: {},
										blockeraPointerEvents: {},
									}}
									values={{
										cursor: currentStateAttributes.blockeraCursor,
										userSelect:
											currentStateAttributes.blockeraUserSelect,
										pointerEvents:
											currentStateAttributes.blockeraPointerEvents,
									}}
									attributes={{
										blockeraCursor:
											attributes.blockeraCursor,
										blockeraUserSelect:
											attributes.blockeraUserSelect,
										blockeraPointerEvents:
											attributes.blockeraPointerEvents,
									}}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									setSettings={handleOnChangeSettings}
								/>
							</ErrorBoundary>
							<SlotFillProvider>
								<Slot
									name={'blockera-inspector-interactions-end'}
								/>
								<ExtensionSlotFill
									{...{
										block,
										settings,
										attributes,
										useBlockSection,
										blockFeatures: additional.blockFeatures,
										currentStateAttributes,
										handleOnChangeSettings,
										handleOnChangeAttributes,
										slotName:
											'blockera-inspector-interactions-end',
									}}
								/>
							</SlotFillProvider>
						</Fragment>
					);
					break;
			}

			return activePanel;
		};

		const tabs = [
			{
				name: 'settings',
				title: __('General', 'blockera'),
				tooltip: __('General Block Settings', 'blockera'),
				className: 'settings-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
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

		return (
			<StateContainer
				availableStates={availableStates}
				blockeraUnsavedData={blockAttributes?.blockeraUnsavedData}
			>
				{useDisplayBlockControls() && (
					<Tabs
						design="modern"
						orientation="horizontal"
						tabs={tabs}
						activeTab={currentTab}
						getPanel={MappedExtensions}
						setCurrentTab={setCurrentTab}
						className="block-inspector-tabs"
					/>
				)}
				{children}
			</StateContainer>
		);
	}
	// FIXME: we should double check this to fix re-rendering problems.
	// propsAreEqual
);
