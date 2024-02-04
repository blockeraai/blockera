// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	TransformControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@publisher/controls';
import { isInteger } from '@publisher/utils';
import { Button, FeatureWrapper } from '@publisher/components';
import {
	componentClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId, hasSameProps } from '../utils';
import { TransformSettings } from './components/transform-setting';
import { Opacity } from './components/opacity';
import { Transition } from './components/transition';
import { Filter } from './components/filter';
import { BackdropFilter } from './components/backdrop-filter';
import { Blending } from './components/blending';
import { Divider } from './components/divider';
import { Mask } from './components/mask';
import { EffectsExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const EffectsExtension: ComponentType<TEffectsProps> = memo(
	({
		values,
		block,
		extensionConfig,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
		attributes,
	}: TEffectsProps): MixedElement => {
		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		const isShowOpacity = isShowField(
			extensionConfig.publisherOpacity,
			values?.publisherOpacity,
			attributes.publisherOpacity.default
		);
		const isShowTransform = isShowField(
			extensionConfig.publisherTransform,
			values?.publisherTransform,
			attributes.publisherTransform.default
		);
		const isShowTransition = isShowField(
			extensionConfig.publisherTransition,
			values?.publisherTransition,
			attributes.publisherTransition.default
		);
		const isShowFilter = isShowField(
			extensionConfig.publisherFilter,
			values?.publisherFilter,
			attributes.publisherFilter.default
		);
		const isShowBackdropFilter = isShowField(
			extensionConfig.publisherBackdropFilter,
			values?.publisherBackdropFilter,
			attributes.publisherBackdropFilter.default
		);
		const isShowDivider = isShowField(
			extensionConfig.publisherDivider,
			values?.publisherDivider,
			attributes.publisherDivider.default
		);
		const isShowMask = isShowField(
			extensionConfig.publisherMask,
			values?.publisherMask,
			attributes.publisherMask.default
		);
		const isShowBlendMode = isShowField(
			extensionConfig.publisherBlendMode,
			values?.publisherBlendMode,
			attributes.publisherBlendMode.default
		);

		// Extension is not active
		if (
			!isShowOpacity &&
			!isShowTransform &&
			!isShowTransition &&
			!isShowFilter &&
			!isShowBackdropFilter &&
			!isShowDivider &&
			!isShowMask &&
			!isShowBlendMode
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Effects', 'publisher-core')}
				initialOpen={true}
				icon={<EffectsExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-effects'
				)}
			>
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'effectsConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowOpacity}
					isActiveOnStates={
						extensionConfig.publisherOpacity.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherOpacity.isActiveOnBreakpoints
					}
				>
					<Opacity
						block={block}
						opacity={values.publisherOpacity}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherOpacity.default}
						{...extensionProps.publisherOpacity}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransform}
					isActiveOnStates={
						extensionConfig.publisherTransform.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherTransform.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transform-2d-3d'),
							value: values.publisherTransform,
							attribute: 'publisherTransform',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							columns="columns-1"
							controlName="transform"
						>
							<TransformControl
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherTransform',
										isInteger(newValue)
											? `${newValue}%`
											: newValue,
										{ ref }
									)
								}
								injectHeaderButtonsStart={
									<>
										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Transformation Settings',
												'publisher-core'
											)}
											size="extra-small"
											className={controlInnerClassNames(
												'btn-add'
											)}
											isFocus={isTransformSettingsVisible}
											onClick={() =>
												setIsTransformSettingsVisible(
													!isTransformSettingsVisible
												)
											}
										>
											<GearIcon />
										</Button>
									</>
								}
								defaultValue={
									attributes.publisherTransform.default
								}
								{...extensionProps.publisherTransform}
							/>

							{isTransformSettingsVisible && (
								<TransformSettings
									setIsTransformSettingsVisible={
										setIsTransformSettingsVisible
									}
									block={block}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									values={{
										transform: values.publisherTransform,
										transformSelfPerspective:
											values.publisherTransformSelfPerspective,
										transformSelfOrigin:
											values.publisherTransformSelfOrigin,
										backfaceVisibility:
											values.publisherBackfaceVisibility,
										transformChildPerspective:
											values.publisherTransformChildPerspective,
										transformChildOrigin:
											values.publisherTransformChildOrigin,
									}}
									attributes={attributes}
								/>
							)}
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransition}
					isActiveOnStates={
						extensionConfig.publisherTransition.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherTransition
							.isActiveOnBreakpoints
					}
				>
					<Transition
						transition={values.publisherTransition}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherTransition.default}
						{...extensionProps.publisherTransition}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFilter}
					isActiveOnStates={
						extensionConfig.publisherFilter.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherFilter.isActiveOnBreakpoints
					}
				>
					<Filter
						filter={values.publisherFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherFilter.default}
						{...extensionProps.publisherFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBackdropFilter}
					isActiveOnStates={
						extensionConfig.publisherBackdropFilter.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherBackdropFilter
							.isActiveOnBreakpoints
					}
				>
					<BackdropFilter
						backdropFilter={values.publisherBackdropFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={
							attributes.publisherBackdropFilter.default
						}
						{...extensionProps.publisherBackdropFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowDivider}
					isActiveOnStates={
						extensionConfig.publisherDivider.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherDivider.isActiveOnBreakpoints
					}
				>
					<Divider
						divider={values.publisherDivider}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherDivider.default}
						{...extensionProps.publisherDivider}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowMask}
					isActiveOnStates={
						extensionConfig.publisherMask.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherMask.isActiveOnBreakpoints
					}
				>
					<Mask
						mask={values.publisherMask}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherMask.default}
						{...extensionProps.publisherMask}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBlendMode}
					isActiveOnStates={
						extensionConfig.publisherBlendMode.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherBlendMode.isActiveOnBreakpoints
					}
				>
					<Blending
						blendMode={values.publisherBlendMode}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherBlendMode.default}
						{...extensionProps.publisherBlendMode}
					/>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
