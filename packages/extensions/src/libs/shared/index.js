// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { memo, useState } from '@wordpress/element';
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
import type { TStates } from '../block-states/types';
import { useBlockContext, useDisplayBlockControls } from '../../hooks';
import { getStateInfo } from '../block-states/helpers';
import StateContainer from '../../components/state-container';
import type { TTabProps } from '@publisher/components/src/tabs/types';
import { InnerBlocksExtension } from '../inner-blocks';
import { SettingsIcon } from './icons/settings';
import { StylesIcon } from './icons/styles';
import { AnimationsIcon } from './icons/animations';
import { STORE_NAME } from '../base/store/constants';
import StatesManager from '../block-states/components/states-manager';
import type { InnerBlockType } from '../inner-blocks/types';
import type { THandleOnChangeAttributes } from '../types';

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
};

type Props = {
	name: string,
	clientId: string,
	supports: Object,
	attributes: Object,
	children?: ComponentType<any>,
	currentStateAttributes: Object,
	publisherInnerBlocks: Array<Object>,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
		attributes,
		setAttributes,
		currentStateAttributes,
		...props
	}: Props): MixedElement => {
		const currentState: TStates =
			currentStateAttributes.publisherCurrentState;
		// dev-mode codes 👇 : to debug re-rendering
		// useTraceUpdate({
		// 	children,
		// 	attributes,
		// 	currentState,
		// 	setAttributes,
		// 	...props,
		// });

		type BlockContextual = {
			currentTab: string,
			blockStateId: number,
			breakpointId: number,
			currentBlock: 'master' | InnerBlockType,
			handleOnChangeAttributes: THandleOnChangeAttributes,
		};

		const {
			currentTab,
			blockStateId,
			breakpointId,
			handleOnChangeAttributes,
		}: BlockContextual = useBlockContext();

		const { currentBlock = 'master' } = useSelect((select) => {
			const { getExtensionCurrentBlock } = select(
				'publisher-core/extensions'
			);

			return {
				currentBlock: getExtensionCurrentBlock(),
			};
		});

		const { layout, flexChild, icon } = extensions;

		props = {
			...props,
			blockStateId,
			breakpointId,
			setAttributes,
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
			entranceAnimationConfig,
			scrollAnimationConfig,
			clickAnimationConfig,
			conditionsConfig,
			advancedSettingsConfig,
		} = settings;

		const block = {
			blockName: props.name,
			clientId: props.clientId,
		};

		const MappedExtensions = (tab: TTabProps): MixedElement => {
			return (
				<>
					<Fill name={'publisher-core-block-card-children'}>
						<StatesManager
							states={currentStateAttributes.publisherBlockStates}
							currentStateType={
								currentStateAttributes.publisherCurrentState
							}
							onChange={handleOnChangeAttributes}
							block={{
								clientId: props.clientId,
								supports,
								setAttributes,
								blockName: props.name,
							}}
							rootStates={attributes?.publisherBlockStates}
						/>
					</Fill>
					<div
						style={{
							display: 'settings' === tab.name ? 'block' : 'none',
						}}
					>
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
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<AdvancedSettingsExtension
							block={block}
							advancedConfig={advancedSettingsConfig}
							values={{
								attributes:
									currentStateAttributes.publisherAttributes,
							}}
							extensionProps={{
								publisherAttributes: {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					</div>
					<div
						style={{
							display: 'style' === tab.name ? 'block' : 'none',
						}}
					>
						<InnerBlocksExtension
							innerBlocks={
								currentStateAttributes?.publisherInnerBlocks ||
								[]
							}
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
									currentStateAttributes.style?.spacing || {},
							}}
						/>

						<PositionExtension
							block={block}
							positionConfig={positionConfig}
							values={{
								position:
									currentStateAttributes.publisherPosition,
								zIndex: currentStateAttributes.publisherZIndex,
							}}
							attributes={{
								position: attributes.publisherPosition,
								zIndex: attributes.publisherZIndex,
							}}
							extensionProps={{
								publisherPosition: {},
								publisherZIndex: {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<SizeExtension
							block={block}
							sizeConfig={sizeConfig}
							values={{
								width: currentStateAttributes.publisherWidth,
								minWidth:
									currentStateAttributes.publisherMinWidth,
								maxWidth:
									currentStateAttributes.publisherMaxWidth,
								height: currentStateAttributes.publisherHeight,
								minHeight:
									currentStateAttributes.publisherMinHeight,
								maxHeight:
									currentStateAttributes.publisherMaxHeight,
								overflow:
									currentStateAttributes.publisherOverflow,
								ratio: currentStateAttributes.publisherRatio,
								fit: currentStateAttributes.publisherFit,
								fitPosition:
									currentStateAttributes.publisherFitPosition,
							}}
							attributes={{
								width: attributes.publisherWidth,
								minWidth: attributes.publisherMinWidth,
								maxWidth: attributes.publisherMaxWidth,
								height: attributes.publisherHeight,
								minHeight: attributes.publisherMinHeight,
								maxHeight: attributes.publisherMaxHeight,
								overflow: attributes.publisherOverflow,
								ratio: attributes.publisherRatio,
								fit: attributes.publisherFit,
								fitPosition: attributes.publisherFitPosition,
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
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>

						<LayoutExtension
							{...{
								block,
								layoutConfig,
								extensionProps: {
									publisherDisplay: {},
									publisherFlexLayout: {},
									publisherGap: {},
									publisherFlexWrap: {},
									publisherAlignContent: {},
								},
								values: include(
									currentStateAttributes,
									layout,
									'publisher'
								),
								defaultValue:
									currentStateAttributes.layout || {},
								handleOnChangeAttributes,
							}}
						/>

						{directParentBlock?.innerBlocks.length &&
							directParentBlock?.attributes.publisherDisplay ===
								'flex' && (
								<FlexChildExtension
									{...{
										block,
										flexChildConfig,
										extensionProps: {
											publisherFlexChildSizing: {},
											publisherFlexChildGrow: {},
											publisherFlexChildShrink: {},
											publisherFlexChildBasis: {},
											publisherFlexChildAlign: {},
											publisherFlexChildOrder: {},
											publisherFlexChildOrderCustom: {},
										},
										values: {
											...include(
												currentStateAttributes,
												flexChild,
												'publisher'
											),
											flexDirection:
												directParentBlock?.attributes
													.publisherFlexDirection,
										},
										handleOnChangeAttributes,
									}}
								/>
							)}

						<TypographyExtension
							block={block}
							typographyConfig={typographyConfig}
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
								fontColor:
									currentStateAttributes?.publisherFontColor,
								fontSize:
									currentStateAttributes?.publisherFontSize,
								lineHeight:
									currentStateAttributes?.publisherLineHeight,
								textAlign:
									currentStateAttributes?.publisherTextAlign,
								textDecoration:
									currentStateAttributes?.publisherTextDecoration,
								fontStyle:
									currentStateAttributes?.publisherFontStyle,
								textTransform:
									currentStateAttributes?.publisherTextTransform,
								direction:
									currentStateAttributes?.publisherDirection,
								textShadow:
									currentStateAttributes?.publisherTextShadow,
								letterSpacing:
									currentStateAttributes?.publisherLetterSpacing,
								wordSpacing:
									currentStateAttributes?.publisherWordSpacing,
								textIndent:
									currentStateAttributes?.publisherTextIndent,
								textOrientation:
									currentStateAttributes?.publisherTextOrientation,
								textColumns:
									currentStateAttributes?.publisherTextColumns,
								textStroke:
									currentStateAttributes?.publisherTextStroke,
								wordBreak:
									currentStateAttributes?.publisherWordBreak,
							}}
							attributes={{
								fontColor: attributes?.publisherFontColor,
								fontSize: attributes?.publisherFontSize,
								lineHeight: attributes?.publisherLineHeight,
								textAlign: attributes?.publisherTextAlign,
								textDecoration:
									attributes?.publisherTextDecoration,
								fontStyle: attributes?.publisherFontStyle,
								textTransform:
									attributes?.publisherTextTransform,
								direction: attributes?.publisherDirection,
								textShadow: attributes?.publisherTextShadow,
								letterSpacing:
									attributes?.publisherLetterSpacing,
								wordSpacing: attributes?.publisherWordSpacing,
								textIndent: attributes?.publisherTextIndent,
								textOrientation:
									attributes?.publisherTextOrientation,
								textColumns: attributes?.publisherTextColumns,
								textStroke: attributes?.publisherTextStroke,
								wordBreak: attributes?.publisherWordBreak,
							}}
							display={currentStateAttributes?.publisherDisplay}
							backgroundClip={
								currentStateAttributes?.publisherBackgroundClip
							}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>

						<BackgroundExtension
							block={block}
							setSettings={handleOnChangeSettings}
							backgroundConfig={backgroundConfig}
							extensionProps={{
								publisherBackground: {},
								publisherBackgroundColor: {},
								publisherBackgroundClip: {},
							}}
							values={{
								background:
									currentStateAttributes?.publisherBackground,
								backgroundColor:
									currentStateAttributes?.publisherBackgroundColor,
								backgroundClip:
									currentStateAttributes?.publisherBackgroundClip,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							attributes={{
								background: attributes.publisherBackground,
								backgroundColor:
									attributes.publisherBackgroundColor,
								backgroundClip:
									attributes.publisherBackgroundClip,
							}}
						/>

						<BorderAndShadowExtension
							block={block}
							borderAndShadowConfig={borderAndShadowConfig}
							extensionProps={{
								publisherBoxShadow: {},
								publisherOutline: {},
								publisherBorder: {},
								publisherBorderRadius: {},
							}}
							values={{
								border: currentStateAttributes.publisherBorder,
								borderRadius:
									currentStateAttributes.publisherBorderRadius,
								outline:
									currentStateAttributes.publisherOutline,
								boxShadow:
									currentStateAttributes.publisherBoxShadow,
							}}
							attributes={{
								border: attributes.publisherBorder,
								borderRadius: attributes.publisherBorderRadius,
								outline: attributes.publisherOutline,
								boxShadow: attributes.publisherBoxShadow,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>

						<EffectsExtension
							block={block}
							effectsConfig={effectsConfig}
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
								opacity:
									currentStateAttributes.publisherOpacity,
								transform:
									currentStateAttributes.publisherTransform,
								backfaceVisibility:
									currentStateAttributes.publisherBackfaceVisibility,
								transformSelfPerspective:
									currentStateAttributes.publisherTransformSelfPerspective,
								transformSelfOrigin:
									currentStateAttributes.publisherTransformSelfOrigin,
								transformChildOrigin:
									currentStateAttributes.publisherTransformChildOrigin,
								transformChildPerspective:
									currentStateAttributes.publisherTransformChildPerspective,
								transition:
									currentStateAttributes.publisherTransition,
								filter: currentStateAttributes.publisherFilter,
								backdropFilter:
									currentStateAttributes.publisherBackdropFilter,
								divider:
									currentStateAttributes.publisherDivider,
								mask: currentStateAttributes.publisherMask,
								blendMode:
									currentStateAttributes.publisherBlendMode,
							}}
							attributes={{
								opacity: attributes.publisherOpacity,
								transform: attributes.publisherTransform,
								backfaceVisibility:
									attributes.publisherBackfaceVisibility,
								transformSelfPerspective:
									attributes.publisherTransformSelfPerspective,
								transformSelfOrigin:
									attributes.publisherTransformSelfOrigin,
								transformChildOrigin:
									attributes.publisherTransformChildOrigin,
								transformChildPerspective:
									attributes.publisherTransformChildPerspective,
								transition: attributes.publisherTransition,
								filter: attributes.publisherFilter,
								backdropFilter:
									attributes.publisherBackdropFilter,
								divider: attributes.publisherDivider,
								mask: attributes.publisherMask,
								blendMode: attributes.publisherBlendMode,
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
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
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					</div>

					<div
						style={{
							display:
								'interactions' === tab.name ? 'block' : 'none',
						}}
					>
						<EntranceAnimationExtension
							block={block}
							extensionConfig={entranceAnimationConfig}
							extensionProps={{}}
							values={{}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<ScrollAnimationExtension
							block={block}
							extensionConfig={scrollAnimationConfig}
							extensionProps={{}}
							values={{}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<ClickAnimationExtension
							block={block}
							extensionConfig={clickAnimationConfig}
							extensionProps={{}}
							values={{}}
							handleOnChangeAttributes={handleOnChangeAttributes}
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
							handleOnChangeAttributes={handleOnChangeAttributes}
							setSettings={handleOnChangeSettings}
						/>
					</div>
				</>
			);
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
			<StateContainer currentState={getStateInfo(currentState)}>
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
