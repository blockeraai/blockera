// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { memo, useEffect } from '@wordpress/element';
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
import { propsAreEqual } from '../../components';
import extensions from './extensions.json';
import type { TStates } from '../block-states/types';
import { useBlockContext, useDisplayBlockControls } from '../../hooks';
import { getStateInfo } from '../block-states/helpers';
import StateContainer from '../../components/state-container';
import type { TTabProps } from '@publisher/components/src/tabs/types';
import * as config from '../base/config';
import { InnerBlocksExtension } from '../inner-blocks';

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
	setParentIsLoad: (isLoad: boolean) => void,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
		setParentIsLoad,
		setAttributes,
		publisherInnerBlocks,
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
			extensionConfig,
			handleOnChangeAttributes,
		} = useBlockContext();

		// eslint-disable-next-line
		useEffect(() => setParentIsLoad(true), []);

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
		} = extensionConfig[currentBlock] || config;

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
					</div>
					<div
						style={{
							display: 'style' === tab.name ? 'block' : 'none',
						}}
					>
						<InnerBlocksExtension
							setParentIsLoad={setParentIsLoad}
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
									currentStateAttributes.style?.spacing || {},
							}}
						/>

						<PositionExtension
							{...{
								block,
								positionConfig,
								inheritValues: {
									position: currentStateAttributes?.style
										?.position?.type
										? {
												type: currentStateAttributes
													?.style?.position?.type,
												position: {
													top: currentStateAttributes
														?.style?.position?.top,
													right: currentStateAttributes
														?.style?.position
														?.right,
													bottom: currentStateAttributes
														?.style?.position
														?.bottom,
													left: currentStateAttributes
														?.style?.position?.left,
												},
										  }
										: undefined,
								},
								values: {
									position:
										currentStateAttributes.publisherPosition,
									zIndex: currentStateAttributes.publisherZIndex,
								},
								extensionProps: {
									publisherPosition: {},
									publisherZIndex: {},
								},
								handleOnChangeAttributes,
							}}
						/>

						<SizeExtension
							{...{
								block,
								sizeConfig,
								values: include(
									currentStateAttributes,
									size,
									'publisher'
								),
								inheritValue: {
									width: currentStateAttributes?.width,
									height: currentStateAttributes?.height,
									minHeight:
										currentStateAttributes?.minHeight,
									minHeightUnit:
										currentStateAttributes?.minHeightUnit,
									aspectRatio:
										currentStateAttributes?.aspectRatio,
									scale: currentStateAttributes?.scale,
								},
								extensionProps: {
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
								},
								handleOnChangeAttributes,
							}}
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
							{...{
								block,
								typographyConfig,
								extensionProps: {
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
								},
								values: {
									...include(
										currentStateAttributes,
										typography,
										'publisher'
									),
									display:
										currentStateAttributes.publisherDisplay,
								},
								backgroundClip:
									currentStateAttributes?.publisherBackgroundClip,
								defaultValue: {
									fontSize:
										currentStateAttributes.fontSize || '',
									fontStyle:
										currentStateAttributes.fontStyle ||
										'normal',
									typography:
										currentStateAttributes.style
											?.typography || {},
								},
								handleOnChangeAttributes,
							}}
						/>

						<BackgroundExtension
							{...{
								block,
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
							{...{
								block,
								borderAndShadowConfig,
								extensionProps: {
									publisherBoxShadow: {},
									publisherOutline: {},
									publisherBorder: {},
									publisherBorderRadius: {},
								},
								values: include(
									currentStateAttributes,
									borderAndShadow,
									'publisher'
								),
								defaultValue: {
									borderColor:
										currentStateAttributes?.borderColor ||
										'',
									border:
										currentStateAttributes.style?.border ||
										{},
								},
								handleOnChangeAttributes,
							}}
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
				</>
			);
		};

		const tabs = [
			{
				name: 'settings',
				title: __('Settings', 'publisher-core'),
				className: 'settings-tab',
				icon: {
					library: 'publisher',
					name: 'publisherSettings',
				},
			},
			{
				name: 'style',
				title: __('Style', 'publisher-core'),
				className: 'style-tab',
				icon: {
					library: 'wp',
					name: 'styles',
				},
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
