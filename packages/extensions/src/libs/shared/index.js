// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import { memo, useEffect, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';
import { Fill } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { include } from '@publisher/utils';
import { Tabs } from '@publisher/components';
// import { useTraceUpdate } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import {
	attributes as backgroundAttributes,
	supports as backgroundSupports,
	BackgroundExtension,
} from '../background';
import {
	attributes as iconAttributes,
	supports as iconSupports,
	IconExtension,
} from '../icon';
import {
	attributes as borderAndShadowAttributes,
	supports as borderAndShadowSupports,
	BorderAndShadowExtension,
} from '../border-and-shadow';
import {
	attributes as effectsAttributes,
	supports as effectsSupports,
	EffectsExtension,
} from '../effects';
import {
	attributes as typographyAttributes,
	supports as typographySupports,
	TypographyExtension,
} from '../typography';
import {
	attributes as spacingAttributes,
	supports as spacingSupports,
	SpacingExtension,
} from '../spacing';
import {
	attributes as positionAttributes,
	supports as positionSupports,
	PositionExtension,
} from '../position';
import {
	attributes as sizeAttributes,
	supports as sizeSupports,
	SizeExtension,
} from '../size';
import {
	attributes as layoutAttributes,
	supports as layoutSupports,
	LayoutExtension,
} from '../layout';
import {
	attributes as flexChildAttributes,
	supports as flexChildSupports,
	FlexChildExtension,
} from '../flex-child';
import {
	CustomStyleExtension,
	attributes as customStyleAttributes,
	supports as customStyleSupports,
} from '../custom-style';
import {
	attributes as mouseAttributes,
	supports as mouseSupports,
	MouseExtension,
} from '../mouse';
import {
	GridChildExtension,
	attributes as gridChildAttributes,
	supports as gridChildSupports,
} from '../grid-child';
import {
	attributes as styleVariationsAttributes,
	StyleVariationsExtension,
} from '../style-variations';
import { EntranceAnimationExtension } from '../entrance-animation';
import { ScrollAnimationExtension } from '../scroll-animation';
import { ClickAnimationExtension } from '../click-animation';
import { ConditionsExtension } from '../conditions';
import {
	attributes as advancedSettingsAttributes,
	AdvancedSettingsExtension,
} from '../advanced-settings';

import { isInnerBlock, propsAreEqual } from '../../components';
import extensions from './extensions.json';
import { useDisplayBlockControls } from '../../hooks';
import StateContainer from '../../components/state-container';
import type { TTabProps } from '@publisher/components/src/tabs/types';
import { InnerBlocksExtension } from '../inner-blocks';
import { SettingsIcon } from './icons/settings';
import { StylesIcon } from './icons/styles';
import { AnimationsIcon } from './icons/animations';
import { STORE_NAME } from '../base/store/constants';
import StatesManager from '../block-states/components/states-manager';
import type { InnerBlocks, InnerBlockType } from '../inner-blocks/types';
import type { THandleOnChangeAttributes } from '../types';
import { resetExtensionSettings } from '../../utils';
import type { TBreakpoint, TStates } from '../block-states/types';

export const attributes = {
	...typographyAttributes,
	...backgroundAttributes,
	...borderAndShadowAttributes,
	...effectsAttributes,
	...spacingAttributes,
	...positionAttributes,
	...sizeAttributes,
	...layoutAttributes,
	...flexChildAttributes,
	...iconAttributes,
	...customStyleAttributes,
	...advancedSettingsAttributes,
	...mouseAttributes,
	...gridChildAttributes,
	...styleVariationsAttributes,
};
export const supports = {
	...typographySupports,
	...backgroundSupports,
	...borderAndShadowSupports,
	...effectsSupports,
	...spacingSupports,
	...positionSupports,
	...sizeSupports,
	...layoutSupports,
	...flexChildSupports,
	...iconSupports,
	...customStyleSupports,
	...mouseSupports,
	...gridChildSupports,
};

type Props = {
	name: string,
	clientId: string,
	supports: Object,
	attributes: Object,
	controllerProps: {
		currentTab: string,
		currentState: TStates,
		publisherInnerBlocks: Object,
		currentBreakpoint: TBreakpoint,
		currentInnerBlockState: TStates,
		currentBlock: 'master' | InnerBlockType,
		handleOnChangeAttributes: THandleOnChangeAttributes,
	},
	children?: ComponentType<any>,
	currentStateAttributes: Object,
	publisherInnerBlocks: InnerBlocks,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
		attributes: currentBlockAttributes,
		setAttributes,
		currentStateAttributes,
		controllerProps: {
			currentTab,
			currentBlock,
			currentState,
			currentBreakpoint,
			publisherInnerBlocks,
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

		const { icon } = extensions;

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

		const supports = getDefinition(currentBlock) || getExtensions();
		const [settings, setSettings] = useState(supports);

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
			iconConfig,
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
			gridChildConfig,
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
					key={`'publisher-core-block-${currentBlock}-card-children'`}
					name={'publisher-core-block-card-children'}
				>
					<StatesManager
						states={currentStateAttributes.publisherBlockStates}
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
							<IconExtension
								{...{
									iconConfig,
									block,
									values: include(
										currentStateAttributes,
										icon,
										'publisher'
									),
									extensionProps: {
										publisherIcon: {},
										publisherIconPosition: {},
										publisherIconGap: {},
										publisherIconSize: {},
										publisherIconColor: {},
										publisherIconLink: {},
									},
									handleOnChangeAttributes,
								}}
							/>

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
									publisherAttributes:
										currentStateAttributes.publisherAttributes,
								}}
								attributes={{
									publisherAttributes:
										attributes.publisherAttributes,
								}}
								extensionProps={{
									publisherAttributes: {
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
								innerBlocks={publisherInnerBlocks}
							/>

							<SpacingExtension
								{...{
									block,
									spacingConfig,
									extensionProps: {
										publisherSpacing: {},
									},
									handleOnChangeAttributes,
									spacingValue:
										currentStateAttributes.publisherSpacing,
									defaultValue:
										currentStateAttributes.style?.spacing ||
										{},
								}}
							/>

							<PositionExtension
								block={block}
								extensionConfig={positionConfig}
								values={{
									publisherPosition:
										currentStateAttributes.publisherPosition,
									publisherZIndex:
										currentStateAttributes.publisherZIndex,
								}}
								attributes={{
									publisherPosition:
										attributes.publisherPosition,
									publisherZIndex: attributes.publisherZIndex,
								}}
								extensionProps={{
									publisherPosition: {},
									publisherZIndex: {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
							/>

							<SizeExtension
								block={block}
								extensionConfig={sizeConfig}
								values={{
									publisherWidth:
										currentStateAttributes.publisherWidth,
									publisherMinWidth:
										currentStateAttributes.publisherMinWidth,
									publisherMaxWidth:
										currentStateAttributes.publisherMaxWidth,
									publisherHeight:
										currentStateAttributes.publisherHeight,
									publisherMinHeight:
										currentStateAttributes.publisherMinHeight,
									publisherMaxHeight:
										currentStateAttributes.publisherMaxHeight,
									publisherOverflow:
										currentStateAttributes.publisherOverflow,
									publisherRatio:
										currentStateAttributes.publisherRatio,
									publisherFit:
										currentStateAttributes.publisherFit,
									publisherFitPosition:
										currentStateAttributes.publisherFitPosition,
								}}
								attributes={{
									publisherWidth: attributes.publisherWidth,
									publisherMinWidth:
										attributes.publisherMinWidth,
									publisherMaxWidth:
										attributes.publisherMaxWidth,
									publisherHeight: attributes.publisherHeight,
									publisherMinHeight:
										attributes.publisherMinHeight,
									publisherMaxHeight:
										attributes.publisherMaxHeight,
									publisherOverflow:
										attributes.publisherOverflow,
									publisherRatio: attributes.publisherRatio,
									publisherFit: attributes.publisherFit,
									publisherFitPosition:
										attributes.publisherFitPosition,
								}}
								extensionProps={{
									publisherWidth: {},
									publisherHeight: {},
									publisherMinWidth: {},
									publisherMinHeight: {},
									publisherMaxWidth: {},
									publisherMaxHeight: {},
									publisherOverflow: {},
									publisherRatio: {},
									publisherFit: {},
									publisherFitPosition: {},
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
									publisherDisplay: {},
									publisherFlexLayout: {},
									publisherGap: {},
									publisherFlexWrap: {},
									publisherAlignContent: {},
									publisherGridAlignItems: {},
									publisherGridJustifyItems: {},
									//publisherGridAlignContent: {},
									//publisherGridJustifyContent: {},
									publisherGridGap: {},
									publisherGridDirection: {},
									publisherGridColumns: {},
									publisherGridRows: {},
									publisherGridAreas: {},
								}}
								values={{
									publisherDisplay:
										currentStateAttributes.publisherDisplay,
									publisherFlexLayout:
										currentStateAttributes.publisherFlexLayout,
									publisherGap:
										currentStateAttributes.publisherGap,
									publisherFlexWrap:
										currentStateAttributes.publisherFlexWrap,
									publisherAlignContent:
										currentStateAttributes.publisherAlignContent,
									publisherGridAlignItems:
										currentStateAttributes.publisherGridAlignItems,
									publisherGridJustifyItems:
										currentStateAttributes.publisherGridJustifyItems,
									// publisherGridAlignContent:
									// 	currentStateAttributes.publisherGridAlignContent,
									// publisherGridJustifyContent:
									// 	currentStateAttributes.publisherGridJustifyContent,
									publisherGridGap:
										currentStateAttributes.publisherGridGap,
									publisherGridDirection:
										currentStateAttributes.publisherGridDirection,
									publisherGridColumns:
										currentStateAttributes.publisherGridColumns,
									publisherGridRows:
										currentStateAttributes.publisherGridRows,
									publisherGridAreas:
										currentStateAttributes.publisherGridAreas,
								}}
								attributes={{
									publisherDisplay:
										attributes.publisherDisplay,
									publisherFlexLayout:
										attributes.publisherFlexLayout,
									publisherGap: attributes.publisherGap,
									publisherFlexWrap:
										attributes.publisherFlexWrap,
									publisherAlignContent:
										attributes.publisherAlignContent,
									publisherGridAlignItems:
										attributes.publisherGridAlignItems,
									publisherGridJustifyItems:
										attributes.publisherGridJustifyItems,
									// publisherGridAlignContent:
									// 	attributes.publisherGridAlignContent,
									// publisherGridJustifyContent:
									// 	attributes.publisherGridJustifyContent,
									publisherGridGap:
										attributes.publisherGridGap,
									publisherGridDirection:
										attributes.publisherGridDirection,
									publisherGridColumns:
										attributes.publisherGridColumns,
									publisherGridRows:
										attributes.publisherGridRows,
									publisherGridAreas:
										attributes.publisherGridAreas,
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>

							{directParentBlock?.innerBlocks.length &&
								directParentBlock?.attributes
									.publisherDisplay === 'flex' && (
									<FlexChildExtension
										block={block}
										extensionConfig={flexChildConfig}
										values={{
											publisherFlexChildSizing:
												currentStateAttributes.publisherFlexChildSizing,
											publisherFlexChildGrow:
												currentStateAttributes.publisherFlexChildGrow,
											publisherFlexChildShrink:
												currentStateAttributes.publisherFlexChildShrink,
											publisherFlexChildBasis:
												currentStateAttributes.publisherFlexChildBasis,
											publisherFlexChildOrder:
												currentStateAttributes.publisherFlexChildOrder,
											publisherFlexChildOrderCustom:
												currentStateAttributes.publisherFlexChildOrderCustom,
											publisherFlexDirection:
												directParentBlock?.attributes
													?.publisherFlexLayout
													?.direction,
										}}
										attributes={{
											publisherFlexChildSizing:
												attributes.publisherFlexChildSizing,
											publisherFlexChildGrow:
												attributes.publisherFlexChildGrow,
											publisherFlexChildShrink:
												attributes.publisherFlexChildShrink,
											publisherFlexChildBasis:
												attributes.publisherFlexChildBasis,
											publisherFlexChildAlign:
												attributes.publisherFlexChildAlign,
											publisherFlexChildOrder:
												attributes.publisherFlexChildOrder,
											publisherFlexChildOrderCustom:
												attributes.publisherFlexChildOrderCustom,
										}}
										extensionProps={{
											publisherFlexChildSizing: {},
											publisherFlexChildGrow: {},
											publisherFlexChildShrink: {},
											publisherFlexChildBasis: {},
											publisherFlexChildAlign: {},
											publisherFlexChildOrder: {},
											publisherFlexChildOrderCustom: {},
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
									publisherFontColor: {},
									publisherFontSize: {},
									publisherLineHeight: {},
									publisherTextAlign: {},
									publisherTextDecoration: {},
									publisherFontStyle: {},
									publisherTextTransform: {},
									publisherDirection: {},
									publisherTextShadow: {},
									publisherLetterSpacing: {},
									publisherWordSpacing: {},
									publisherTextIndent: {},
									publisherTextOrientation: {},
									publisherTextColumns: {},
									publisherTextStroke: {},
									publisherWordBreak: {},
								}}
								values={{
									publisherFontColor:
										currentStateAttributes?.publisherFontColor,
									publisherFontSize:
										currentStateAttributes?.publisherFontSize,
									publisherLineHeight:
										currentStateAttributes?.publisherLineHeight,
									publisherTextAlign:
										currentStateAttributes?.publisherTextAlign,
									publisherTextDecoration:
										currentStateAttributes?.publisherTextDecoration,
									publisherFontStyle:
										currentStateAttributes?.publisherFontStyle,
									publisherTextTransform:
										currentStateAttributes?.publisherTextTransform,
									publisherDirection:
										currentStateAttributes?.publisherDirection,
									publisherTextShadow:
										currentStateAttributes?.publisherTextShadow,
									publisherLetterSpacing:
										currentStateAttributes?.publisherLetterSpacing,
									publisherWordSpacing:
										currentStateAttributes?.publisherWordSpacing,
									publisherTextIndent:
										currentStateAttributes?.publisherTextIndent,
									publisherTextOrientation:
										currentStateAttributes?.publisherTextOrientation,
									publisherTextColumns:
										currentStateAttributes?.publisherTextColumns,
									publisherTextStroke:
										currentStateAttributes?.publisherTextStroke,
									publisherWordBreak:
										currentStateAttributes?.publisherWordBreak,
								}}
								attributes={{
									publisherFontColor:
										attributes?.publisherFontColor,
									publisherFontSize:
										attributes?.publisherFontSize,
									publisherLineHeight:
										attributes?.publisherLineHeight,
									publisherTextAlign:
										attributes?.publisherTextAlign,
									publisherTextDecoration:
										attributes?.publisherTextDecoration,
									publisherFontStyle:
										attributes?.publisherFontStyle,
									publisherTextTransform:
										attributes?.publisherTextTransform,
									publisherDirection:
										attributes?.publisherDirection,
									publisherTextShadow:
										attributes?.publisherTextShadow,
									publisherLetterSpacing:
										attributes?.publisherLetterSpacing,
									publisherWordSpacing:
										attributes?.publisherWordSpacing,
									publisherTextIndent:
										attributes?.publisherTextIndent,
									publisherTextOrientation:
										attributes?.publisherTextOrientation,
									publisherTextColumns:
										attributes?.publisherTextColumns,
									publisherTextStroke:
										attributes?.publisherTextStroke,
									publisherWordBreak:
										attributes?.publisherWordBreak,
								}}
								display={
									currentStateAttributes?.publisherDisplay
								}
								backgroundClip={
									currentStateAttributes?.publisherBackgroundClip
								}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								setSettings={handleOnChangeSettings}
							/>
							{directParentBlock?.innerBlocks.length &&
								directParentBlock?.attributes
									.publisherDisplay === 'grid' && (
									<GridChildExtension
										block={block}
										extensionConfig={gridChildConfig}
										extensionProps={{
											publisherGridChildLayout: {},
											publisherGridChildOrder: {},
										}}
										values={{
											publisherGridChildLayout:
												currentStateAttributes.publisherGridChildLayout,
											publisherGridChildOrder:
												currentStateAttributes.publisherGridChildOrder,
											gridAreas:
												directParentBlock?.attributes
													.publisherGridAreas,
										}}
										attributes={{
											publisherGridChildLayout:
												attributes.publisherGridChildLayout,
											publisherGridChildOrder:
												attributes.publisherGridChildOrder,
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
									publisherFontColor: {},
									publisherFontSize: {},
									publisherLineHeight: {},
									publisherTextAlign: {},
									publisherTextDecoration: {},
									publisherFontStyle: {},
									publisherTextTransform: {},
									publisherDirection: {},
									publisherTextShadow: {},
									publisherLetterSpacing: {},
									publisherWordSpacing: {},
									publisherTextIndent: {},
									publisherTextOrientation: {},
									publisherTextColumns: {},
									publisherTextStroke: {},
									publisherWordBreak: {},
								}}
								values={{
									publisherFontColor:
										currentStateAttributes?.publisherFontColor,
									publisherFontSize:
										currentStateAttributes?.publisherFontSize,
									publisherLineHeight:
										currentStateAttributes?.publisherLineHeight,
									publisherTextAlign:
										currentStateAttributes?.publisherTextAlign,
									publisherTextDecoration:
										currentStateAttributes?.publisherTextDecoration,
									publisherFontStyle:
										currentStateAttributes?.publisherFontStyle,
									publisherTextTransform:
										currentStateAttributes?.publisherTextTransform,
									publisherDirection:
										currentStateAttributes?.publisherDirection,
									publisherTextShadow:
										currentStateAttributes?.publisherTextShadow,
									publisherLetterSpacing:
										currentStateAttributes?.publisherLetterSpacing,
									publisherWordSpacing:
										currentStateAttributes?.publisherWordSpacing,
									publisherTextIndent:
										currentStateAttributes?.publisherTextIndent,
									publisherTextOrientation:
										currentStateAttributes?.publisherTextOrientation,
									publisherTextColumns:
										currentStateAttributes?.publisherTextColumns,
									publisherTextStroke:
										currentStateAttributes?.publisherTextStroke,
									publisherWordBreak:
										currentStateAttributes?.publisherWordBreak,
								}}
								attributes={{
									publisherFontColor:
										attributes?.publisherFontColor,
									publisherFontSize:
										attributes?.publisherFontSize,
									publisherLineHeight:
										attributes?.publisherLineHeight,
									publisherTextAlign:
										attributes?.publisherTextAlign,
									publisherTextDecoration:
										attributes?.publisherTextDecoration,
									publisherFontStyle:
										attributes?.publisherFontStyle,
									publisherTextTransform:
										attributes?.publisherTextTransform,
									publisherDirection:
										attributes?.publisherDirection,
									publisherTextShadow:
										attributes?.publisherTextShadow,
									publisherLetterSpacing:
										attributes?.publisherLetterSpacing,
									publisherWordSpacing:
										attributes?.publisherWordSpacing,
									publisherTextIndent:
										attributes?.publisherTextIndent,
									publisherTextOrientation:
										attributes?.publisherTextOrientation,
									publisherTextColumns:
										attributes?.publisherTextColumns,
									publisherTextStroke:
										attributes?.publisherTextStroke,
									publisherWordBreak:
										attributes?.publisherWordBreak,
								}}
								display={
									currentStateAttributes?.publisherDisplay
								}
								backgroundClip={
									currentStateAttributes?.publisherBackgroundClip
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
									publisherBackground: {},
									publisherBackgroundColor: {},
									publisherBackgroundClip: {},
								}}
								values={{
									publisherBackground:
										currentStateAttributes?.publisherBackground,
									publisherBackgroundColor:
										currentStateAttributes?.publisherBackgroundColor,
									publisherBackgroundClip:
										currentStateAttributes?.publisherBackgroundClip,
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								attributes={{
									publisherBackground:
										attributes.publisherBackground,
									publisherBackgroundColor:
										attributes.publisherBackgroundColor,
									publisherBackgroundClip:
										attributes.publisherBackgroundClip,
								}}
							/>

							<BorderAndShadowExtension
								block={block}
								extensionConfig={borderAndShadowConfig}
								extensionProps={{
									publisherBorder: {},
									publisherBorderRadius: {},
									publisherBoxShadow: {},
									publisherOutline: {},
								}}
								values={{
									publisherBorder:
										currentStateAttributes.publisherBorder,
									publisherBorderRadius:
										currentStateAttributes.publisherBorderRadius,
									publisherOutline:
										currentStateAttributes.publisherOutline,
									publisherBoxShadow:
										currentStateAttributes.publisherBoxShadow,
								}}
								attributes={{
									publisherBorder: attributes.publisherBorder,
									publisherBorderRadius:
										attributes.publisherBorderRadius,
									publisherOutline:
										attributes.publisherOutline,
									publisherBoxShadow:
										attributes.publisherBoxShadow,
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
									publisherOpacity: {},
									publisherTransform: {},
									publisherTransformSelfPerspective: {},
									publisherTransformSelfOrigin: {},
									publisherBackfaceVisibility: {},
									publisherTransformChildPerspective: {},
									publisherTransformChildOrigin: {},
									publisherTransition: {},
									publisherFilter: {},
									publisherBackdropFilter: {},
									publisherDivider: {},
									publisherBlendMode: {},
									publisherMask: {},
								}}
								values={{
									publisherOpacity:
										currentStateAttributes.publisherOpacity,
									publisherTransform:
										currentStateAttributes.publisherTransform,
									publisherBackfaceVisibility:
										currentStateAttributes.publisherBackfaceVisibility,
									publisherTransformSelfPerspective:
										currentStateAttributes.publisherTransformSelfPerspective,
									publisherTransformSelfOrigin:
										currentStateAttributes.publisherTransformSelfOrigin,
									publisherTransformChildOrigin:
										currentStateAttributes.publisherTransformChildOrigin,
									publisherTransformChildPerspective:
										currentStateAttributes.publisherTransformChildPerspective,
									publisherTransition:
										currentStateAttributes.publisherTransition,
									publisherFilter:
										currentStateAttributes.publisherFilter,
									publisherBackdropFilter:
										currentStateAttributes.publisherBackdropFilter,
									publisherDivider:
										currentStateAttributes.publisherDivider,
									publisherMask:
										currentStateAttributes.publisherMask,
									publisherBlendMode:
										currentStateAttributes.publisherBlendMode,
								}}
								attributes={{
									publisherOpacity:
										attributes.publisherOpacity,
									publisherTransform:
										attributes.publisherTransform,
									publisherBackfaceVisibility:
										attributes.publisherBackfaceVisibility,
									publisherTransformSelfPerspective:
										attributes.publisherTransformSelfPerspective,
									publisherTransformSelfOrigin:
										attributes.publisherTransformSelfOrigin,
									publisherTransformChildOrigin:
										attributes.publisherTransformChildOrigin,
									publisherTransformChildPerspective:
										attributes.publisherTransformChildPerspective,
									publisherTransition:
										attributes.publisherTransition,
									publisherFilter: attributes.publisherFilter,
									publisherBackdropFilter:
										attributes.publisherBackdropFilter,
									publisherDivider:
										attributes.publisherDivider,
									publisherMask: attributes.publisherMask,
									publisherBlendMode:
										attributes.publisherBlendMode,
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
									publisherCustomCSS: {},
								}}
								values={{
									publisherCustomCSS:
										currentStateAttributes.publisherCustomCSS,
								}}
								attributes={{
									publisherCustomCSS:
										attributes.publisherCustomCSS,
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
									publisherCursor: {},
									publisherUserSelect: {},
									publisherPointerEvents: {},
								}}
								values={{
									cursor: currentStateAttributes.publisherCursor,
									userSelect:
										currentStateAttributes.publisherUserSelect,
									pointerEvents:
										currentStateAttributes.publisherPointerEvents,
								}}
								attributes={{
									publisherCursor: attributes.publisherCursor,
									publisherUserSelect:
										attributes.publisherUserSelect,
									publisherPointerEvents:
										attributes.publisherPointerEvents,
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
				title: __('Settings', 'publisher-core'),
				tooltip: __('Block Settings', 'publisher-core'),
				className: 'settings-tab',
				icon: <SettingsIcon />,
			},
			{
				name: 'style',
				title: __('Styles', 'publisher-core'),
				tooltip: __('Block Design & Style Settings', 'publisher-core'),
				className: 'style-tab',
				icon: <StylesIcon />,
			},
			{
				name: 'interactions',
				title: __('Animations', 'publisher-core'),
				tooltip: __(
					'Block Interactions and Animations',
					'publisher-core'
				),
				className: 'style-tab',
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
	},
	propsAreEqual
);
