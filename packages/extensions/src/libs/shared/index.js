// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { memo } from '@wordpress/element';
import type { Node, MixedElement } from 'react';
import {
	Slot,
	// Fill,
} from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { include } from '@publisher/utils';
import { Tabs } from '@publisher/components';
// import { useTraceUpdate } from '@publisher/hooks';

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
import type { TStates } from '../block-states/types';
import { useBlockContext } from '../../hooks';
import { getStateInfo } from '../block-states/helpers';
import StateContainer from '../../components/state-container';
import type { TTabProps } from '@publisher/components/src/tabs/types';

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
	children?: Node,
	clientId: string,
	supports: Object,
	activeTab: string,
	currentStateAttributes: Object,
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: Props = memo(
	({
		children,
		activeTab,
		currentStateAttributes,
		setAttributes,
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

		const { blockStateId, breakpointId, handleOnChangeAttributes } =
			useBlockContext();

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

		const MappedExtensions = (tab: TTabProps): MixedElement => {
			return (
				<>
					<div
						style={{
							display: 'settings' === tab.name ? 'block' : 'none',
						}}
					>
						<>
							<BaseExtension
								{...props}
								extensionProps={{
									publisherIcon: {},
									publisherIconPosition: {},
									publisherIconGap: {},
									publisherIconSize: {},
									publisherIconColor: {},
									publisherIconLink: {},
								}}
								values={include(
									currentStateAttributes,
									icon,
									'publisher'
								)}
								initialOpen={true}
								extensionId={'Icon'}
								title={__('Icon', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<IconExtensionIcon />}
							/>

							<Slot
								name={`block-inspector-tab-${tab.name}-start`}
							/>
							<Slot name={`block-inspector-tab-${tab.name}-1`} />
							<Slot name={`block-inspector-tab-${tab.name}-2`} />
							<Slot name={`block-inspector-tab-${tab.name}-3`} />
							<Slot name={`block-inspector-tab-${tab.name}-4`} />
							<Slot name={`block-inspector-tab-${tab.name}-5`} />
							<Slot name={`block-inspector-tab-${tab.name}-6`} />
							<Slot name={`block-inspector-tab-${tab.name}-7`} />
							<Slot name={`block-inspector-tab-${tab.name}-8`} />
							<Slot name={`block-inspector-tab-${tab.name}-9`} />
							<Slot name={`block-inspector-tab-${tab.name}-10`} />

							<Slot
								name={`block-inspector-tab-${tab.name}-end`}
							/>
						</>
					</div>
					<div
						style={{
							display: 'style' === tab.name ? 'block' : 'none',
						}}
					>
						<>
							<BaseExtension
								{...props}
								extensionProps={{
									publisherSpacing: {},
								}}
								initialOpen={true}
								extensionId={'Spacing'}
								defaultValue={
									currentStateAttributes.style?.spacing || {}
								}
								spacingValue={
									currentStateAttributes.publisherSpacing
								}
								title={__('Spacing', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<SpacingExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								values={{
									position:
										currentStateAttributes.publisherPosition,
									zIndex: currentStateAttributes.publisherZIndex,
								}}
								inheritValues={{
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
								}}
								extensionProps={{
									publisherPosition: {},
									publisherZIndex: {},
								}}
								initialOpen={true}
								extensionId={'Position'}
								title={__('Position', 'publisher-core')}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<PositionExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								values={include(
									currentStateAttributes,
									size,
									'publisher'
								)}
								inheritValue={{
									width: currentStateAttributes?.width,
									height: currentStateAttributes?.height,
									minHeight:
										currentStateAttributes?.minHeight,
									minHeightUnit:
										currentStateAttributes?.minHeightUnit,
									aspectRatio:
										currentStateAttributes?.aspectRatio,
									scale: currentStateAttributes?.scale,
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
								extensionProps={{
									publisherDisplay: {},
									publisherFlexDirection: {},
									publisherAlignItems: {},
									publisherJustifyContent: {},
									publisherGap: {},
									publisherFlexWrap: {},
									publisherAlignContent: {},
								}}
								initialOpen={true}
								extensionId={'Layout'}
								title={__('Layout', 'publisher-core')}
								values={include(
									currentStateAttributes,
									layout,
									'publisher'
								)}
								defaultValue={
									currentStateAttributes.layout || {}
								}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<LayoutExtensionIcon />}
							/>

							{directParentBlock?.innerBlocks.length &&
								directParentBlock?.currentStateAttributes
									.publisherDisplay === 'flex' && (
									<BaseExtension
										{...props}
										extensionProps={{
											publisherFlexChildSizing: {},
											publisherFlexChildGrow: {},
											publisherFlexChildShrink: {},
											publisherFlexChildBasis: {},
											publisherFlexChildAlign: {},
											publisherFlexChildOrder: {},
											publisherFlexChildOrderCustom: {},
										}}
										initialOpen={true}
										extensionId={'FlexChild'}
										title={__(
											'Flex Child',
											'publisher-core'
										)}
										values={{
											...include(
												currentStateAttributes,
												flexChild,
												'publisher'
											),
											flexDirection:
												directParentBlock
													?.currentStateAttributes
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
								initialOpen={true}
								extensionId={'Typography'}
								title={__('Typography', 'publisher-core')}
								values={{
									...include(
										currentStateAttributes,
										typography,
										'publisher'
									),
									display:
										currentStateAttributes.publisherDisplay,
								}}
								backgroundClip={
									currentStateAttributes?.publisherBackgroundClip
								}
								defaultValue={{
									fontSize:
										currentStateAttributes.fontSize || '',
									typography:
										currentStateAttributes.style
											?.typography || {},
								}}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								icon={<TypographyExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								extensionProps={{
									publisherBackground: {},
									publisherBackgroundColor: {},
									publisherBackgroundClip: {},
								}}
								initialOpen={true}
								extensionId={'Background'}
								values={include(
									currentStateAttributes,
									background,
									'publisher'
								)}
								defaultValue={
									currentStateAttributes.style?.background ||
									{}
								}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Background', 'publisher-core')}
								icon={<BackgroundExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								extensionProps={{
									publisherBoxShadow: {},
									publisherOutline: {},
									publisherBorder: {},
									publisherBorderRadius: {},
								}}
								initialOpen={true}
								extensionId={'BorderAndShadow'}
								values={include(
									currentStateAttributes,
									borderAndShadow,
									'publisher'
								)}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								defaultValue={{
									borderColor:
										currentStateAttributes?.borderColor ||
										'',
									border:
										currentStateAttributes.style?.border ||
										{},
								}}
								title={__(
									'Border And Shadow',
									'publisher-core'
								)}
								icon={<BorderAndShadowExtensionIcon />}
							/>

							<BaseExtension
								{...props}
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
								initialOpen={true}
								extensionId={'Effects'}
								values={include(
									currentStateAttributes,
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
								extensionProps={{
									publisherCursor: {},
									publisherUserSelect: {},
									publisherPointerEvents: {},
								}}
								initialOpen={true}
								extensionId={'Mouse'}
								values={include(
									currentStateAttributes,
									mouse,
									'publisher'
								)}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								title={__('Mouse', 'publisher-core')}
								icon={<MouseExtensionIcon />}
							/>

							<BaseExtension
								{...props}
								extensionProps={{
									publisherAttributes: {},
									publisherCSSProperties: {},
								}}
								initialOpen={true}
								extensionId={'Advanced'}
								values={include(
									currentStateAttributes,
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
				<Tabs
					tabs={tabs}
					activeTab={activeTab}
					getPanel={MappedExtensions}
				/>
				{children}
			</StateContainer>
		);
	},
	hasSameProps
);
