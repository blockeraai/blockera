// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { memo } from '@wordpress/element';
import type { Node, MixedElement } from 'react';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import { include } from '@publisher/utils';
import { Tabs } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BaseExtension } from '../base';
import {
	BackgroundExtensionIcon,
	attributes as backgroundAttributes,
	supports as backgroundSupports,
} from '../background';
import {
	IconExtensionIcon,
	attributes as iconAttributes,
	supports as iconSupports,
} from '../icon';
import {
	BorderAndShadowExtensionIcon,
	attributes as borderAndShadowAttributes,
	supports as borderAndShadowSupports,
} from '../border-and-shadow';
import {
	EffectsExtensionIcon,
	attributes as effectsAttributes,
	supports as effectsSupports,
} from '../effects';
import {
	TypographyExtensionIcon,
	attributes as typographyAttributes,
	supports as typographySupports,
} from '../typography';
import {
	SpacingExtensionIcon,
	attributes as spacingAttributes,
	supports as spacingSupports,
} from '../spacing';
import {
	PositionExtensionIcon,
	attributes as positionAttributes,
	supports as positionSupports,
} from '../position';
import {
	SizeExtensionIcon,
	attributes as sizeAttributes,
	supports as sizeSupports,
} from '../size';
import {
	LayoutExtensionIcon,
	attributes as layoutAttributes,
	supports as layoutSupports,
} from '../layout';
import {
	FlexChildExtensionIcon,
	attributes as flexChildAttributes,
	supports as flexChildSupports,
} from '../flex-child';
import {
	AdvancedExtensionIcon,
	attributes as advancedAttributes,
	supports as advancedSupports,
} from '../advanced';
import {
	MouseExtensionIcon,
	attributes as mouseAttributes,
	supports as mouseSupports,
} from '../mouse';
import { hasSameProps } from '../utils';
import extensions from './extensions.json';
import { ExtensionStyle } from '../base/style';
import type { TStates } from '../block-states/types';
import { useBlockContext } from '../../hooks';
import { getStateInfo } from '../block-states/helpers';
import StateContainer from '../../components/state-container';
// import { useTraceUpdate } from '@publisher/hooks';

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
	children?: Node,
	clientId: string,
	attributes: Object,
	currentState: TStates,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: Props = memo(
	({
		children,
		attributes,
		currentState,
		setAttributes,
		...props
	}: Props): MixedElement => {
		// dev-mode codes 👇 : to debug re-rendering
		// useTraceUpdate({
		// 	children,
		// 	attributes,
		// 	currentState,
		// 	setAttributes,
		// 	...props,
		// });

		const {
			blockStateId,
			breakpointId,
			activeDeviceType,
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
			activeDeviceType,
			handleOnChangeAttributes,
		};

		const parentClientIds = select('core/block-editor').getBlockParents(
			props.clientId
		);

		const directParentBlock = select('core/block-editor').getBlock(
			parentClientIds[parentClientIds.length - 1]
		);

		const MappedExtensions = (tab: {
			name: string,
			title: string,
			className: string,
		}): MixedElement => {
			switch (tab.name) {
				case 'general':
					return (
						<>
							<BaseExtension
								{...props}
								attributes={{
									publisherIcon: attributes.publisherIcon,
									publisherIconPosition:
										attributes.publisherIconPosition,
									publisherIconGap:
										attributes.publisherIconGap,
									publisherIconSize:
										attributes.publisherIconSize,
									publisherIconColor:
										attributes.publisherIconColor,
									publisherIconLink:
										attributes.publisherIconLink,
								}}
								values={include(attributes, icon, 'publisher')}
								initialOpen={true}
								extensionId={'Icon'}
								title={__('Icon', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<IconExtensionIcon />}
							/>
						</>
					);
				case 'style':
					return (
						<>
							<BaseExtension
								{...props}
								attributes={{
									publisherSpacing:
										attributes.publisherSpacing,
								}}
								initialOpen={true}
								extensionId={'Spacing'}
								defaultValue={attributes.style?.spacing || {}}
								spacingValue={attributes.publisherSpacing}
								title={__('Spacing', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<SpacingExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherPosition:
										attributes.publisherPosition,
									publisherZIndex: attributes.publisherZIndex,
								}}
								initialOpen={true}
								extensionId={'Position'}
								zIndexValue={attributes.publisherZIndex}
								positionValue={attributes.publisherPosition}
								title={__('Position', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<PositionExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								{...include(attributes, size, 'publisher')}
								attributes={{
									publisherWidth: attributes.publisherWidth,
									publisherHeight: attributes.publisherHeight,
									publisherMinWidth:
										attributes.publisherMinWidth,
									publisherMinHeight:
										attributes.publisherMinHeight,
									publisherMaxWidth:
										attributes.publisherMaxWidth,
									publisherMaxHeight:
										attributes.publisherMaxHeight,
									publisherOverflow:
										attributes.publisherOverflow,
									publisherRatio: attributes.publisherRatio,
									publisherFit: attributes.publisherFit,
									publisherFitPosition:
										attributes.publisherFitPosition,
								}}
								defaultValue={{
									width:
										attributes.width ||
										attributes.publisherWidth,
									height:
										attributes.height ||
										attributes.publisherHeight,
									overflow: attributes.publisherOverflow,
								}}
								initialOpen={true}
								extensionId={'Size'}
								title={__('Size', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<SizeExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherDisplay:
										attributes.publisherDisplay,
									publisherFlexDirection:
										attributes.publisherFlexDirection,
									publisherAlignItems:
										attributes.publisherAlignItems,
									publisherJustifyContent:
										attributes.publisherJustifyContent,
									publisherGap: attributes.publisherGap,
									publisherFlexWrap:
										attributes.publisherFlexWrap,
									publisherAlignContent:
										attributes.publisherAlignContent,
								}}
								initialOpen={true}
								extensionId={'Layout'}
								title={__('Layout', 'publisher-core')}
								values={include(
									attributes,
									layout,
									'publisher'
								)}
								defaultValue={attributes.layout || {}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<LayoutExtensionIcon />}
							/>

							{directParentBlock?.innerBlocks.length &&
								directParentBlock?.attributes
									.publisherDisplay === 'flex' && (
									<BaseExtension
										{...props}
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
										initialOpen={true}
										extensionId={'FlexChild'}
										title={__(
											'Flex Child',
											'publisher-core'
										)}
										values={{
											...include(
												attributes,
												flexChild,
												'publisher'
											),
											flexDirection:
												directParentBlock?.attributes
													.publisherFlexDirection,
										}}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										icon={<FlexChildExtensionIcon />}
									/>
								)}

							<BaseExtension
								{...props}
								attributes={{
									publisherFontColor:
										attributes.publisherFontColor,
									publisherFontSize:
										attributes.publisherFontSize,
									publisherLineHeight:
										attributes.publisherLineHeight,
									publisherTextAlign:
										attributes.publisherTextAlign,
									publisherTextDecoration:
										attributes.publisherTextDecoration,
									publisherFontStyle:
										attributes.publisherFontStyle,
									publisherTextTransform:
										attributes.publisherTextTransform,
									publisherDirection:
										attributes.publisherDirection,
									publisherTextShadow:
										attributes.publisherTextShadow,
									publisherLetterSpacing:
										attributes.publisherLetterSpacing,
									publisherWordSpacing:
										attributes.publisherWordSpacing,
									publisherTextIndent:
										attributes.publisherTextIndent,
									publisherTextOrientation:
										attributes.publisherTextOrientation,
									publisherTextColumns:
										attributes.publisherTextColumns,
									publisherTextStroke:
										attributes.publisherTextStroke,
									publisherWordBreak:
										attributes.publisherWordBreak,
								}}
								initialOpen={true}
								extensionId={'Typography'}
								title={__('Typography', 'publisher-core')}
								values={{
									...include(
										attributes,
										typography,
										'publisher'
									),
									display: attributes.publisherDisplay,
								}}
								backgroundClip={
									attributes?.publisherBackgroundClip
								}
								defaultValue={{
									fontSize:
										attributes.fontSize ||
										attributes.publisherFontSize,
									typography:
										attributes.style?.typography || {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<TypographyExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherBackground:
										attributes.publisherBackground,
									publisherBackgroundColor:
										attributes.publisherBackgroundColor,
									publisherBackgroundClip:
										attributes.publisherBackgroundClip,
								}}
								initialOpen={true}
								extensionId={'Background'}
								values={include(
									attributes,
									background,
									'publisher'
								)}
								defaultValue={
									attributes.style?.background || {}
								}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Background', 'publisher-core')}
								icon={<BackgroundExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherBoxShadow:
										attributes.publisherBoxShadow,
									publisherOutline:
										attributes.publisherOutline,
									publisherBorder: attributes.publisherBorder,
									publisherBorderRadius:
										attributes.publisherBorderRadius,
								}}
								initialOpen={true}
								extensionId={'BorderAndShadow'}
								values={include(
									attributes,
									borderAndShadow,
									'publisher'
								)}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								defaultValue={{
									borderColor: attributes?.borderColor || '',
									border: attributes.style?.border || {},
								}}
								title={__(
									'Border And Shadow',
									'publisher-core'
								)}
								icon={<BorderAndShadowExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherOpacity:
										attributes.publisherOpacity,
									publisherTransform:
										attributes.publisherTransform,
									publisherTransformSelfPerspective:
										attributes.publisherTransformSelfPerspective,
									publisherTransformSelfOrigin:
										attributes.publisherTransformSelfOrigin,
									publisherBackfaceVisibility:
										attributes.publisherBackfaceVisibility,
									publisherTransformChildPerspective:
										attributes.publisherTransformChildPerspective,
									publisherTransformChildOrigin:
										attributes.publisherTransformChildOrigin,
									publisherTransition:
										attributes.publisherTransition,
									publisherFilter: attributes.publisherFilter,
									publisherBackdropFilter:
										attributes.publisherBackdropFilter,
									publisherDivider:
										attributes.publisherDivider,
									publisherBlendMode:
										attributes.publisherBlendMode,
									publisherMask: attributes.publisherMask,
								}}
								initialOpen={true}
								extensionId={'Effects'}
								values={include(
									attributes,
									effects,
									'publisher'
								)}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Effects', 'publisher-core')}
								icon={<EffectsExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherCursor: attributes.publisherCursor,
									publisherUserSelect:
										attributes.publisherUserSelect,
									publisherPointerEvents:
										attributes.publisherPointerEvents,
								}}
								initialOpen={true}
								extensionId={'Mouse'}
								values={include(attributes, mouse, 'publisher')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Mouse', 'publisher-core')}
								icon={<MouseExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								attributes={{
									publisherAttributes:
										attributes.publisherAttributes,
									publisherCSSProperties:
										attributes.publisherCSSProperties,
								}}
								initialOpen={true}
								extensionId={'Advanced'}
								values={include(
									attributes,
									advanced,
									'publisher'
								)}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Advanced', 'publisher-core')}
								icon={<AdvancedExtensionIcon />}
							/>
						</>
					);
			}

			return <></>;
		};

		const tabs = [
			{
				name: 'general',
				title: __('General', 'publisher-core'),
				className: 'general-tab',
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
			<>
				<InspectorControls>
					<StateContainer currentState={getStateInfo(currentState)}>
						<Tabs tabs={tabs} getPanel={MappedExtensions} />
						{children}
					</StateContainer>
				</InspectorControls>

				<ExtensionStyle
					{...props}
					attributes={attributes} // todo: check and remove this for optimizing performance because it's a large object
					extensions={[
						'Icon',
						'Size',
						'Layout',
						'Spacing',
						'Effects',
						'Position',
						'Advanced',
						'FlexChild',
						'Typography',
						'Background',
						'BorderAndShadow',
						'Mouse',
					]}
				/>
			</>
		);
	},
	hasSameProps
);
