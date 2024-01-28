// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import { memo, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

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
	AdvancedExtension,
	attributes as advancedAttributes,
	supports as advancedSupports,
} from '../advanced';
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
	...advancedAttributes,
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
	...advancedSupports,
	...mouseSupports,
};

type Props = {
	name: string,
	clientId: string,
	supports: Object,
	children?: ComponentType<any>,
	currentStateAttributes: Object,
	publisherInnerBlocks: Array<Object>,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
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

		const {
			currentTab,
			currentBlock,
			blockStateId,
			breakpointId,
			handleOnChangeAttributes,
		} = useBlockContext();

		const {
			size,
			layout,
			effects,
			flexChild,
			typography,
			background,
			borderAndShadow,
			icon,
			mouse,
			advanced,
		} = extensions;

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
			advancedConfig,
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
							currentBlock={currentBlock}
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
							extensionProps={{
								publisherPosition: {},
								publisherZIndex: {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<SizeExtension
							block={block}
							sizeConfig={sizeConfig}
							values={include(
								currentStateAttributes,
								size,
								'publisher'
							)}
							attributes={include(attributes, size, 'publisher')}
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
							values={include(
								currentStateAttributes,
								typography,
								'publisher'
							)}
							display={currentStateAttributes?.publisherDisplay}
							backgroundClip={
								currentStateAttributes?.publisherBackgroundClip
							}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<BackgroundExtension
							{...{
								block,
								setSettings: handleOnChangeSettings,
								backgroundConfig,
								extensionProps: {
									publisherBackground: {},
									publisherBackgroundColor: {},
									publisherBackgroundClip: {},
								},
								values: include(
									currentStateAttributes,
									background,
									'publisher'
								),
								backgroundClip:
									currentStateAttributes?.publisherBackgroundClip,
								defaultValue:
									currentStateAttributes.style?.background ||
									{},
								handleOnChangeAttributes,
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
							values={include(
								currentStateAttributes,
								borderAndShadow,
								'publisher'
							)}
							defaultValue={{
								borderColor:
									currentStateAttributes?.borderColor || '',
								border:
									currentStateAttributes.style?.border || {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>

						<EffectsExtension
							{...{
								block,
								effectsConfig,
								extensionProps: {
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
								},
								values: include(
									currentStateAttributes,
									effects,
									'publisher'
								),
								handleOnChangeAttributes,
							}}
						/>

						<AdvancedExtension
							{...{
								block,
								advancedConfig,
								extensionProps: {
									publisherAttributes: {},
									publisherCSSProperties: {},
								},
								values: include(
									currentStateAttributes,
									advanced,
									'publisher'
								),
								handleOnChangeAttributes,
							}}
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
							{...{
								block,
								mouseConfig,
								extensionProps: {
									publisherCursor: {},
									publisherUserSelect: {},
									publisherPointerEvents: {},
								},
								values: include(
									currentStateAttributes,
									mouse,
									'publisher'
								),
								handleOnChangeAttributes,
							}}
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
