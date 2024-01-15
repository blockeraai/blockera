// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { memo } from '@wordpress/element';
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
	BackgroundExtensionIcon,
	attributes as backgroundAttributes,
	supports as backgroundSupports,
	BackgroundExtension,
} from '../background';
import {
	IconExtensionIcon,
	attributes as iconAttributes,
	supports as iconSupports,
	IconExtension,
} from '../icon';
import {
	BorderAndShadowExtensionIcon,
	attributes as borderAndShadowAttributes,
	supports as borderAndShadowSupports,
	BorderAndShadowExtension,
} from '../border-and-shadow';
import {
	EffectsExtensionIcon,
	attributes as effectsAttributes,
	supports as effectsSupports,
	EffectsExtension,
} from '../effects';
import {
	TypographyExtensionIcon,
	attributes as typographyAttributes,
	supports as typographySupports,
	TypographyExtension,
} from '../typography';
import {
	SpacingExtensionIcon,
	attributes as spacingAttributes,
	supports as spacingSupports,
	SpacingExtension,
} from '../spacing';
import {
	PositionExtensionIcon,
	attributes as positionAttributes,
	supports as positionSupports,
	PositionExtension,
} from '../position';
import {
	SizeExtensionIcon,
	attributes as sizeAttributes,
	supports as sizeSupports,
	SizeExtension,
} from '../size';
import {
	LayoutExtensionIcon,
	attributes as layoutAttributes,
	supports as layoutSupports,
	LayoutExtension,
} from '../layout';
import {
	FlexChildExtensionIcon,
	attributes as flexChildAttributes,
	supports as flexChildSupports,
	FlexChildExtension,
} from '../flex-child';
import {
	AdvancedExtension,
	AdvancedExtensionIcon,
	attributes as advancedAttributes,
	supports as advancedSupports,
} from '../advanced';
import {
	MouseExtensionIcon,
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
import { componentClassNames } from '@publisher/classnames';
import * as config from '../base/config';
import { PanelBodyControl } from '@publisher/controls';

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
	setAttributes: (attributes: Object) => void,
};

export const SharedBlockExtension: ComponentType<Props> = memo(
	({
		children,
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
		} = config;

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
						<PanelBodyControl
							title={__('Icon', 'publisher-core')}
							initialOpen={true}
							icon={<IconExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-icon'
							)}
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
						</PanelBodyControl>
					</div>
					<div
						style={{
							display: 'style' === tab.name ? 'block' : 'none',
						}}
					>
						<PanelBodyControl
							title={__('Spacing', 'publisher-core')}
							initialOpen={true}
							icon={<SpacingExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-spacing'
							)}
						>
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Position', 'publisher-core')}
							initialOpen={true}
							icon={<PositionExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-position'
							)}
						>
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
															?.style?.position
															?.top,
														right: currentStateAttributes
															?.style?.position
															?.right,
														bottom: currentStateAttributes
															?.style?.position
															?.bottom,
														left: currentStateAttributes
															?.style?.position
															?.left,
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Size', 'publisher-core')}
							initialOpen={true}
							icon={<SizeExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-size'
							)}
						>
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Layout', 'publisher-core')}
							initialOpen={true}
							icon={<LayoutExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-layout'
							)}
						>
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
						</PanelBodyControl>

						{directParentBlock?.innerBlocks.length &&
							directParentBlock?.attributes.publisherDisplay ===
								'flex' && (
								<PanelBodyControl
									title={__('Flex Child', 'publisher-core')}
									initialOpen={true}
									icon={<FlexChildExtensionIcon />}
									className={componentClassNames(
										'extension',
										'extension-flex-child'
									)}
								>
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
												publisherFlexChildOrderCustom:
													{},
											},
											values: {
												...include(
													currentStateAttributes,
													flexChild,
													'publisher'
												),
												flexDirection:
													directParentBlock
														?.attributes
														.publisherFlexDirection,
											},
											handleOnChangeAttributes,
										}}
									/>
								</PanelBodyControl>
							)}

						<PanelBodyControl
							title={__('Typography', 'publisher-core')}
							initialOpen={true}
							icon={<TypographyExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-typography'
							)}
						>
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
											currentStateAttributes.fontSize ||
											'',
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Background', 'publisher-core')}
							initialOpen={true}
							icon={<BackgroundExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-background'
							)}
						>
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
										currentStateAttributes.style
											?.background || {},
									handleOnChangeAttributes,
								}}
							/>
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Border And Shadow', 'publisher-core')}
							initialOpen={true}
							icon={<BorderAndShadowExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-border-and-shadow'
							)}
						>
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
											currentStateAttributes.style
												?.border || {},
									},
									handleOnChangeAttributes,
								}}
							/>
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Effects', 'publisher-core')}
							initialOpen={true}
							icon={<EffectsExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-effects'
							)}
						>
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Mouse', 'publisher-core')}
							initialOpen={true}
							icon={<MouseExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-mouse'
							)}
						>
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
						</PanelBodyControl>

						<PanelBodyControl
							title={__('Advanced', 'publisher-core')}
							initialOpen={true}
							icon={<AdvancedExtensionIcon />}
							className={componentClassNames(
								'extension',
								'extension-advanced'
							)}
						>
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
						</PanelBodyControl>
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
