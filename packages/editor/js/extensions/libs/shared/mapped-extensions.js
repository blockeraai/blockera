// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { Fragment, type MixedElement } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Slot, SlotFillProvider } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	type TTabProps,
	SearchControl,
	ControlContextProvider,
	NoticeControl,
} from '@blockera/controls';
import { ExtensionSlotFill } from '@blockera/features-core';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components/utils';
import { ErrorBoundaryFallback } from '../../hooks/block-settings';
import { BackgroundExtension } from '../background';
import { BorderAndShadowExtension } from '../border-and-shadow';
import { EffectsExtension } from '../effects';
import { TypographyExtension } from '../typography';
import { PositionExtension } from '../position';
import { SizeExtension } from '../size';
import { LayoutExtension } from '../layout';
import { FlexChildExtension } from '../flex-child';
import { GridChildExtension } from '../grid-child';
import { CustomStyleExtension } from '../custom-style';
import { MouseExtension } from '../mouse';
import { StateOptionsExtension } from '../block-card/block-states/extension';
// import { EntranceAnimationExtension } from '../entrance-animation';
// import { ScrollAnimationExtension } from '../scroll-animation';
import { ClickAnimationExtension } from '../click-animation';
// import { ConditionsExtension } from '../conditions';
import { AdvancedSettingsExtension } from '../advanced-settings';
import { useBlockSection } from '../../components';
import { useParentLayoutContext } from './utils';
import { generateExtensionId } from '../utils';
import { useFeatureSearch } from '../../components/feature-search-context';
import {
	configHasFeatureEntries,
	filterSettingsBySearch,
} from '../base/utils/search-features';
import { gridChildConfig as defaultGridChildConfig } from '../base/config/grid-child';

/** Settings keys for the Style tab (MappedExtensions case 'style'). */
const STYLE_TAB_CONFIG_KEYS: Array<string> = [
	'statesConfig',
	'layoutConfig',
	'typographyConfig',
	'backgroundConfig',
	'borderAndShadowConfig',
	'sizeConfig',
	'positionConfig',
	'effectsConfig',
	'customStyleConfig',
];

export const MappedExtensions = ({
	tab,
	block,
	settings,
	attributes,
	additional,
	currentBlock,
	currentState,
	activeSearchMode,
	currentBreakpoint,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeSettings,
	handleOnChangeAttributes,
	isReportingErrorCompleted,
	setIsReportingErrorCompleted,
}: {
	tab: TTabProps,
	block: Object,
	settings: Object,
	attributes: Object,
	additional: Object,
	currentBlock: string,
	currentState: string,
	currentBreakpoint: string,
	activeSearchMode: boolean,
	currentInnerBlockState: string,
	currentStateAttributes: Object,
	handleOnChangeSettings: Function,
	handleOnChangeAttributes: Function,
	isReportingErrorCompleted: boolean,
	setIsReportingErrorCompleted: Function,
}): Array<MixedElement> => {
	const { searchQuery, setSearchQuery } = useFeatureSearch();

	// Filter additional settings based on search query
	const filteredAdditional = useMemo(() => {
		if (!searchQuery || !searchQuery.trim() || !additional?.settings) {
			return additional;
		}

		const filteredSettings = filterSettingsBySearch(
			additional.settings || {},
			searchQuery
		);

		return {
			...additional,
			settings: filteredSettings,
		};
	}, [searchQuery, additional]);

	const activePanel: Array<MixedElement> = [];
	const {
		mouseConfig,
		sizeConfig,
		layoutConfig,
		statesConfig,
		effectsConfig,
		positionConfig,
		flexChildConfig,
		gridChildConfig: gridChildConfigSetting,
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

	/**
	 * Parent display context (flex / grid) for flex-child and grid-child extensions.
	 */
	const parentLayout = useParentLayoutContext({
		clientId: block.clientId,
		blockName: block.blockName,
		currentBlock: block.currentBlock,
		currentState,
		currentInnerBlockState,
		currentBreakpoint: currentBreakpoint || block.currentBreakpoint || '',
	});
	const isParentFlexBlock = parentLayout.layout === 'flex';
	const parentFlexDirection = parentLayout.flexDirection;
	const gridChildConfig = gridChildConfigSetting ?? defaultGridChildConfig;

	// Must stay in sync with extension configs rendered under case 'style' (plus flex/grid child when shown).
	const styleTabHasSearchMatches = useMemo(() => {
		const q = searchQuery?.trim();
		if (!q || tab.name !== 'styles') {
			return true;
		}
		const keysLen = STYLE_TAB_CONFIG_KEYS.length;
		for (let i = 0; i < keysLen; i++) {
			if (configHasFeatureEntries(settings[STYLE_TAB_CONFIG_KEYS[i]])) {
				return true;
			}
		}
		if (
			parentLayout.layout === 'flex' &&
			configHasFeatureEntries(settings.flexChildConfig)
		) {
			return true;
		}
		if (
			parentLayout.layout === 'grid' &&
			configHasFeatureEntries(gridChildConfig)
		) {
			return true;
		}
		return false;
	}, [searchQuery, tab.name, settings, parentLayout.layout, gridChildConfig]);

	switch (tab.name) {
		case 'setting':
			activePanel.push(
				<Fragment key={`${block.clientId}-settings-panel`}>
					<SlotFillProvider>
						<Slot name={'blockera-inspector-settings-start'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode,
								blockFeatures: additional.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-settings-start',
							}}
						/>
					</SlotFillProvider>

					{/* <ErrorBoundary
								fallbackRender={({ error }): MixedElement => (
												<ErrorBoundaryFallback
													isReportingErrorCompleted={isReportingErrorCompleted}
													clientId={block.clientId}
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
								activeSearchMode,
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
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								configId={'advancedSettingsConfig'}
								title={__('Advanced', 'blockera')}
								icon={<Icon icon="extension-advanced" />}
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
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					</ErrorBoundary>
					<SlotFillProvider>
						<Slot name={'blockera-inspector-settings-end'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode,
								blockFeatures: additional.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-settings-end',
							}}
						/>
					</SlotFillProvider>
				</Fragment>
			);
			break;

		case 'styles':
			activePanel.push(
				<Fragment key={`${block.clientId}-style-panel`}>
					<SlotFillProvider>
						<Slot name={'blockera-inspector-styles-start'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode: Boolean(
									searchQuery && searchQuery.trim()
								),
								blockFeatures:
									filteredAdditional?.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-styles-start',
							}}
						/>
					</SlotFillProvider>

					<ControlContextProvider
						value={{
							name: generateExtensionId(
								{
									blockName: block.blockName,
									clientId: block.clientId,
									currentBlockStyleVariation:
										block.currentBlockStyleVariation,
									attributes: {},
									setAttributes: () => {},
									supports: {},
								},
								'search'
							),
							value: searchQuery,
							blockName: block.blockName,
						}}
					>
						<div style={{ padding: '16px' }}>
							<SearchControl
								className="search-features"
								onChange={setSearchQuery}
								placeholder={__('Search Features…', 'blockera')}
							/>
							{searchQuery?.trim() &&
							!styleTabHasSearchMatches ? (
								// role/aria on wrapper: NoticeControl props are not typed for a11y attrs in Flow.
								<div
									className="blockera-search-features-empty"
									role="status"
									aria-live="polite"
									style={{ marginTop: '20px' }}
								>
									<NoticeControl
										type="information"
										field="blockera-feature-search-empty"
									>
										<p>
											<strong>
												{__(
													'No features match your search.',
													'blockera'
												)}
											</strong>
										</p>
										<p>
											{__(
												'Try a different word or check the spelling.',
												'blockera'
											)}
										</p>
										<Button
											variant="link"
											onClick={() => setSearchQuery('')}
											style={{
												padding: 0,
												height: 'auto',
												fontSize: '12px',
											}}
										>
											{__('Clear search', 'blockera')}
										</Button>
									</NoticeControl>
								</div>
							) : null}
						</div>
					</ControlContextProvider>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'statesConfig'}
								title={__('Block State Options', 'blockera')}
								// icon={<Icon icon="extension-states" />}
							/>
						)}
					>
						<StateOptionsExtension
							block={block}
							extensionConfig={statesConfig}
							values={currentStateAttributes.blockeraBlockStates}
							attributes={{
								blockeraBlockStates:
									attributes.blockeraBlockStates,
							}}
							extensionProps={{}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
							currentBlock={currentBlock}
							currentState={
								isInnerBlock(currentBlock)
									? currentInnerBlockState
									: currentState
							}
						/>
					</ErrorBoundary>

					{isParentFlexBlock && (
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
									title={__('Flex Child', 'blockera')}
									icon={<Icon icon="extension-flex-child" />}
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
									blockeraFlexDirection: parentFlexDirection,
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
									blockeraFlexChildOrderCustom: {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>
						</ErrorBoundary>
					)}

					{parentLayout.layout === 'grid' && (
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
									configId={'gridChildConfig'}
									title={__('Grid Child', 'blockera')}
									icon={<Icon icon="extension-grid-child" />}
								/>
							)}
						>
							<GridChildExtension
								block={block}
								extensionConfig={gridChildConfig}
								values={{
									blockeraGridChildColumnSpan:
										currentStateAttributes.blockeraGridChildColumnSpan,
									blockeraGridChildRowSpan:
										currentStateAttributes.blockeraGridChildRowSpan,
								}}
								attributes={{
									blockeraGridChildColumnSpan:
										attributes.blockeraGridChildColumnSpan,
									blockeraGridChildRowSpan:
										attributes.blockeraGridChildRowSpan,
								}}
								extensionProps={{
									blockeraGridChildColumnSpan: {},
									blockeraGridChildRowSpan: {},
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
								clientId={block.clientId}
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
								blockeraSpacing: {},
								blockeraGridMinimumColumnWidth: {},
								blockeraGridColumnCount: {},
							}}
							values={{
								blockeraDisplay:
									currentStateAttributes.blockeraDisplay,
								blockeraFlexLayout:
									currentStateAttributes.blockeraFlexLayout,
								blockeraGap: currentStateAttributes.blockeraGap,
								blockeraFlexWrap:
									currentStateAttributes.blockeraFlexWrap,
								blockeraAlignContent:
									currentStateAttributes.blockeraAlignContent,
								blockeraSpacing:
									currentStateAttributes.blockeraSpacing,
								blockeraGridMinimumColumnWidth:
									currentStateAttributes.blockeraGridMinimumColumnWidth,
								blockeraGridColumnCount:
									currentStateAttributes.blockeraGridColumnCount,
							}}
							attributes={{
								blockeraDisplay: attributes.blockeraDisplay,
								blockeraFlexLayout:
									attributes.blockeraFlexLayout,
								blockeraGap: attributes.blockeraGap,
								blockeraFlexWrap: attributes.blockeraFlexWrap,
								blockeraAlignContent:
									attributes.blockeraAlignContent,
								blockeraSpacing: attributes.blockeraSpacing,
								blockeraGridMinimumColumnWidth:
									attributes.blockeraGridMinimumColumnWidth,
								blockeraGridColumnCount:
									attributes.blockeraGridColumnCount,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'typographyConfig'}
								title={__('Typography', 'blockera')}
								icon={<Icon icon="extension-typography" />}
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
								blockeraFontSize: attributes?.blockeraFontSize,
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
								blockeraTextWrap: attributes?.blockeraTextWrap,
							}}
							display={currentStateAttributes?.blockeraDisplay}
							backgroundClip={
								currentStateAttributes?.blockeraBackgroundClip
							}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								title={__('Background', 'blockera')}
								icon={<Icon icon="extension-background" />}
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
								blockeraBlendMode: {},
							}}
							values={{
								blockeraBackground:
									currentStateAttributes?.blockeraBackground,
								blockeraBackgroundColor:
									currentStateAttributes?.blockeraBackgroundColor,
								blockeraBackgroundClip:
									currentStateAttributes?.blockeraBackgroundClip,
								blockeraBlendMode:
									currentStateAttributes.blockeraBlendMode,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							attributes={{
								blockeraBackground:
									attributes.blockeraBackground,
								blockeraBackgroundColor:
									attributes.blockeraBackgroundColor,
								blockeraBackgroundClip:
									attributes.blockeraBackgroundClip,
								blockeraBlendMode: attributes.blockeraBlendMode,
							}}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'borderAndShadowConfig'}
								title={__('Border And Shadow', 'blockera')}
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
								blockeraBorder: attributes.blockeraBorder,
								blockeraBorderRadius:
									attributes.blockeraBorderRadius,
								blockeraOutline: attributes.blockeraOutline,
								blockeraBoxShadow: attributes.blockeraBoxShadow,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
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
								activeSearchMode: Boolean(
									searchQuery && searchQuery.trim()
								),
								blockFeatures:
									filteredAdditional?.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-styles',
							}}
						/>
					</SlotFillProvider>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
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
								blockeraFit: currentStateAttributes.blockeraFit,
								blockeraFitPosition:
									currentStateAttributes.blockeraFitPosition,
								blockeraBoxSizing:
									currentStateAttributes.blockeraBoxSizing,
							}}
							attributes={{
								blockeraWidth: attributes.blockeraWidth,
								blockeraMinWidth: attributes.blockeraMinWidth,
								blockeraMaxWidth: attributes.blockeraMaxWidth,
								blockeraHeight: attributes.blockeraHeight,
								blockeraMinHeight: attributes.blockeraMinHeight,
								blockeraMaxHeight: attributes.blockeraMaxHeight,
								blockeraOverflow: attributes.blockeraOverflow,
								blockeraRatio: attributes.blockeraRatio,
								blockeraFit: attributes.blockeraFit,
								blockeraFitPosition:
									attributes.blockeraFitPosition,
								blockeraBoxSizing: attributes.blockeraBoxSizing,
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
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'positionConfig'}
								title={__('Position', 'blockera')}
								icon={<Icon icon="extension-position" />}
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
								blockeraPosition: attributes.blockeraPosition,
								blockeraZIndex: attributes.blockeraZIndex,
							}}
							extensionProps={{
								blockeraPosition: {},
								blockeraZIndex: {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
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
								blockeraDivider:
									currentStateAttributes.blockeraDivider,
								blockeraMask:
									currentStateAttributes.blockeraMask,
							}}
							attributes={{
								blockeraOpacity: attributes.blockeraOpacity,
								blockeraTransform: attributes.blockeraTransform,
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
								blockeraFilter: attributes.blockeraFilter,
								blockeraBackdropFilter:
									attributes.blockeraBackdropFilter,
								blockeraDivider: attributes.blockeraDivider,
								blockeraMask: attributes.blockeraMask,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'customStyleConfig'}
								title={__('Custom CSS', 'blockera')}
								icon={<Icon icon="extension-custom-style" />}
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
								blockeraCustomCSS: attributes.blockeraCustomCSS,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
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
								activeSearchMode: Boolean(
									searchQuery && searchQuery.trim()
								),
								blockFeatures:
									filteredAdditional?.blockFeatures,
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
				<Fragment key={`${block.clientId}-interactions-panel`}>
					<SlotFillProvider>
						<Slot name={'blockera-inspector-interactions-start'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode,
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
													clientId={block.clientId}
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
													clientId={block.clientId}
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
						<Slot name={'blockera-inspector-interactions'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode,
								blockFeatures: additional.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-interactions',
							}}
						/>
					</SlotFillProvider>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
								setIsReportingErrorCompleted={
									setIsReportingErrorCompleted
								}
								from={'extension'}
								error={error}
								configId={'clickAnimationConfig'}
								title={__('On Click', 'blockera')}
								icon={<Icon icon="extension-click-animation" />}
							/>
						)}
					>
						<ClickAnimationExtension
							block={block}
							extensionConfig={clickAnimationConfig}
							extensionProps={{}}
							values={{}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					</ErrorBoundary>

					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryFallback
								isReportingErrorCompleted={
									isReportingErrorCompleted
								}
								clientId={block.clientId}
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
								blockeraCursor: attributes.blockeraCursor,
								blockeraUserSelect:
									attributes.blockeraUserSelect,
								blockeraPointerEvents:
									attributes.blockeraPointerEvents,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</ErrorBoundary>
					<SlotFillProvider>
						<Slot name={'blockera-inspector-interactions-end'} />
						<ExtensionSlotFill
							{...{
								block,
								settings,
								attributes,
								useBlockSection,
								activeSearchMode,
								blockFeatures: additional.blockFeatures,
								currentStateAttributes,
								handleOnChangeSettings,
								handleOnChangeAttributes,
								slotName: 'blockera-inspector-interactions-end',
							}}
						/>
					</SlotFillProvider>
				</Fragment>
			);
			break;
	}

	return activePanel;
};
