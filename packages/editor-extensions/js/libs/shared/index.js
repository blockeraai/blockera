// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fill } from '@wordpress/components';
import { select, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import { memo, useEffect, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { Tabs } from '@blockera/components';
// import { useTraceUpdate } from '@blockera/editor';
import type { TTabProps } from '@blockera/components/js/tabs/types';

/**
 * Internal dependencies
 */
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
import { StyleVariationsExtension } from '../style-variations';
import { EntranceAnimationExtension } from '../entrance-animation';
import { ScrollAnimationExtension } from '../scroll-animation';
import { ClickAnimationExtension } from '../click-animation';
import { ConditionsExtension } from '../conditions';
import { AdvancedSettingsExtension } from '../advanced-settings';
import {
	isInnerBlock,
	// FIXME: we are double check this to fix re-rendering problems.
	// propsAreEqual
} from '../../components/utils';
import { attributes } from './attributes';
import { useDisplayBlockControls } from '../../hooks';
import StateContainer from '../../components/state-container';
import { InnerBlocksExtension } from '../inner-blocks';
import { SettingsIcon } from './icons/settings';
import { StylesIcon } from './icons/styles';
import { AnimationsIcon } from './icons/animations';
import { STORE_NAME } from '../base/store/constants';
import StatesManager from '../block-states/components/states-manager';
import type { InnerBlocks, InnerBlockType } from '../inner-blocks/types';
import type { THandleOnChangeAttributes } from '../types';
import { resetExtensionSettings } from '../../utils';
import type { StateTypes, TBreakpoint, TStates } from '../block-states/types';

type Props = {
	name: string,
	clientId: string,
	supports: Object,
	attributes: Object,
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
	availableBlockStates: { [key: TStates | string]: StateTypes },
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
		attributes: currentBlockAttributes,
		setAttributes,
		availableBlockStates,
		currentStateAttributes,
		controllerProps: {
			currentTab,
			currentBlock,
			currentState,
			currentBreakpoint,
			blockeraInnerBlocks,
			currentInnerBlockState,
			handleOnChangeAttributes,
		},
		...props
	}: Props): MixedElement => {
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

		const parentClientIds = select('core/block-editor').getBlockParents(
			props.clientId
		);

		const directParentBlock = select('core/block-editor').getBlock(
			parentClientIds[parentClientIds.length - 1]
		);

		const { updateExtension, updateDefinitionExtensionSupport } =
			useDispatch(STORE_NAME);
		const { getExtensions, getDefinition } = select(STORE_NAME);

		const supports = getExtensions();
		const [settings, setSettings] = useState(supports);

		// Get next settings after switch between blocks.
		useEffect(() => {
			if (isInnerBlock(currentBlock)) {
				const innerBlockDefinition = getDefinition(currentBlock);

				if (
					innerBlockDefinition &&
					!isEquals(innerBlockDefinition, settings)
				) {
					setSettings(innerBlockDefinition);

					return;
				}
			}

			if (isEquals(supports, settings)) {
				return;
			}

			setSettings(supports);
			// eslint-disable-next-line
		}, [currentBlock]);

		const handleOnChangeSettings = (
			newSettings: Object,
			key: string
		): void => {
			setSettings({
				...settings,
				[key]: {
					...settings[key],
					...newSettings,
				},
			});

			if (isInnerBlock(currentBlock)) {
				updateDefinitionExtensionSupport(
					key,
					newSettings,
					currentBlock
				);

				return;
			}

			updateExtension(key, newSettings);
		};

		const {
			mouseConfig,
			sizeConfig,
			layoutConfig,
			spacingConfig,
			effectsConfig,
			positionConfig,
			customStyleConfig,
			flexChildConfig,
			backgroundConfig,
			typographyConfig,
			borderAndShadowConfig,
			entranceAnimationConfig,
			scrollAnimationConfig,
			clickAnimationConfig,
			conditionsConfig,
			advancedSettingsConfig,
			styleVariationsConfig,
		} = settings;

		const block = {
			blockName: props.name,
			clientId: props.clientId,
			// FIXME: important!
			// 1- create new constant with "forceUpdateProps" name and assign below constants into that.
			// 2- we should pass below constants to all extensions,
			// because needs re-rendering extensions when switch between master or inner blocks and as well as switch between block states!
			currentBlock,
			currentState,
			currentInnerBlockState,
			currentBreakpoint,
		};

		const MappedExtensions = (tab: TTabProps): Array<MixedElement> => {
			const activePanel = [
				<Fill
					key={`'blockera-core-block-${currentBlock}-card-children'`}
					name={'blockera-core-block-card-children'}
				>
					<StatesManager
						states={currentStateAttributes.blockeraBlockStates}
						availableStates={availableBlockStates}
						onChange={handleOnChangeAttributes}
						block={{
							clientId: props.clientId,
							supports,
							setAttributes,
							blockName: props.name,
						}}
						{...{
							currentBlock,
							currentState,
							currentBreakpoint,
							currentInnerBlockState,
						}}
					/>
				</Fill>,
			];

			switch (tab.name) {
				case 'settings':
					activePanel.push(
						<>
							<ConditionsExtension
								block={block}
								extensionConfig={conditionsConfig}
								extensionProps={{}}
								values={{}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

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
						</>
					);
					break;

				case 'style':
					activePanel.push(
						<>
							<StyleVariationsExtension
								block={block}
								extensionConfig={styleVariationsConfig}
							/>

							<InnerBlocksExtension
								innerBlocks={blockeraInnerBlocks}
							/>

							<SpacingExtension
								block={block}
								extensionConfig={spacingConfig}
								values={{
									blockeraSpacing:
										currentStateAttributes.blockeraSpacing,
								}}
								attributes={{
									blockeraSpacing: attributes.blockeraSpacing,
								}}
								extensionProps={{
									blockeraSpacing: {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

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
									blockeraZIndex: attributes.blockeraZIndex,
								}}
								extensionProps={{
									blockeraPosition: {},
									blockeraZIndex: {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

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
								}}
								attributes={{
									blockeraWidth: attributes.blockeraWidth,
									blockeraMinWidth:
										attributes.blockeraMinWidth,
									blockeraMaxWidth:
										attributes.blockeraMaxWidth,
									blockeraHeight: attributes.blockeraHeight,
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
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>

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
									blockeraDisplay: attributes.blockeraDisplay,
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

							{directParentBlock?.innerBlocks.length &&
								directParentBlock?.attributes
									.blockeraDisplay === 'flex' && (
									<FlexChildExtension
										block={block}
										extensionConfig={flexChildConfig}
										values={{
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
												directParentBlock?.attributes
													?.blockeraFlexLayout
													?.direction,
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
								)}

							<TypographyExtension
								block={block}
								extensionConfig={typographyConfig}
								extensionProps={{
									blockeraFontColor: {},
									blockeraFontSize: {},
									blockeraLineHeight: {},
									blockeraTextAlign: {},
									blockeraTextDecoration: {},
									blockeraFontStyle: {},
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
								}}
								values={{
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
									blockeraFontStyle:
										currentStateAttributes?.blockeraFontStyle,
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
								}}
								attributes={{
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
									blockeraFontStyle:
										attributes?.blockeraFontStyle,
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
									blockeraBoxShadow:
										attributes.blockeraBoxShadow,
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>

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
								}}
								attributes={{
									blockeraOpacity: attributes.blockeraOpacity,
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
									blockeraFilter: attributes.blockeraFilter,
									blockeraBackdropFilter:
										attributes.blockeraBackdropFilter,
									blockeraBlendMode:
										attributes.blockeraBlendMode,
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>

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
							/>
						</>
					);
					break;

				case 'interactions':
					activePanel.push(
						<>
							<EntranceAnimationExtension
								block={block}
								extensionConfig={entranceAnimationConfig}
								extensionProps={{}}
								values={{}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

							<ScrollAnimationExtension
								block={block}
								extensionConfig={scrollAnimationConfig}
								extensionProps={{}}
								values={{}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

							<ClickAnimationExtension
								block={block}
								extensionConfig={clickAnimationConfig}
								extensionProps={{}}
								values={{}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

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
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>
						</>
					);
					break;
			}

			return activePanel;
		};

		const tabs = [
			{
				name: 'settings',
				title: __('Settings', 'blockera'),
				tooltip: __('Block Settings', 'blockera'),
				className: 'settings-tab',
				icon: <SettingsIcon />,
			},
			{
				name: 'style',
				title: __('Styles', 'blockera'),
				tooltip: __('Block Design & Style Settings', 'blockera'),
				className: 'style-tab',
				icon: <StylesIcon />,
			},
			{
				name: 'interactions',
				title: __('Animations', 'blockera'),
				tooltip: __('Block Interactions and Animations', 'blockera'),
				className: 'interactions-tab',
				icon: <AnimationsIcon />,
			},
		];

		return (
			<StateContainer>
				{useDisplayBlockControls() && (
					<Tabs
						tabs={tabs}
						activeTab={currentTab}
						getPanel={MappedExtensions}
					/>
				)}
				{children}
			</StateContainer>
		);
	}
	// FIXME: we are double check this to fix re-rendering problems.
	// propsAreEqual
);

export { supports } from './supports';
export { attributes } from './attributes';
