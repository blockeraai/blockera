// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	TransformControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { isInteger, hasSameProps } from '@blockera/utils';
import { Button } from '@blockera/components';
import { FeatureWrapper } from '@blockera/editor';
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId } from '../utils';
import { TransformSettings } from './components/transform-setting';
import { Opacity } from './components/opacity';
import { Transition } from './components/transition';
import { Filter } from './components/filter';
import { BackdropFilter } from './components/backdrop-filter';
import { Blending } from './components/blending';
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
			extensionConfig.blockeraOpacity,
			values?.blockeraOpacity,
			attributes.blockeraOpacity.default
		);
		const isShowTransform = isShowField(
			extensionConfig.blockeraTransform,
			values?.blockeraTransform,
			attributes.blockeraTransform.default
		);
		const isShowTransition = isShowField(
			extensionConfig.blockeraTransition,
			values?.blockeraTransition,
			attributes.blockeraTransition.default
		);
		const isShowFilter = isShowField(
			extensionConfig.blockeraFilter,
			values?.blockeraFilter,
			attributes.blockeraFilter.default
		);
		const isShowBackdropFilter = isShowField(
			extensionConfig.blockeraBackdropFilter,
			values?.blockeraBackdropFilter,
			attributes.blockeraBackdropFilter.default
		);
		const isShowBlendMode = isShowField(
			extensionConfig.blockeraBlendMode,
			values?.blockeraBlendMode,
			attributes.blockeraBlendMode.default
		);

		// Extension is not active
		if (
			!isShowOpacity &&
			!isShowTransform &&
			!isShowTransition &&
			!isShowFilter &&
			!isShowBackdropFilter &&
			!isShowBlendMode
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Effects', 'blockera')}
				initialOpen={true}
				icon={<EffectsExtensionIcon />}
				className={extensionClassNames('effects')}
			>
				<ExtensionSettings
					buttonLabel={__('More Effect Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'effectsConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowOpacity}
					config={extensionConfig.blockeraOpacity}
				>
					<Opacity
						block={block}
						opacity={values.blockeraOpacity}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraOpacity.default}
						{...extensionProps.blockeraOpacity}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransform}
					config={extensionConfig.blockeraTransform}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transform-2d-3d'),
							value: values.blockeraTransform,
							attribute: 'blockeraTransform',
							blockName: block.blockName,
						}}
						storeName={'blockera-core/controls/repeater'}
					>
						<BaseControl
							columns="columns-1"
							controlName="transform"
						>
							<TransformControl
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'blockeraTransform',
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
												'blockera'
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
									attributes.blockeraTransform.default
								}
								{...extensionProps.blockeraTransform}
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
									values={values}
									attributes={attributes}
								/>
							)}
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransition}
					config={extensionConfig.blockeraTransition}
				>
					<Transition
						transition={values.blockeraTransition}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraTransition.default}
						{...extensionProps.blockeraTransition}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFilter}
					config={extensionConfig.blockeraFilter}
				>
					<Filter
						filter={values.blockeraFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraFilter.default}
						{...extensionProps.blockeraFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBackdropFilter}
					config={extensionConfig.blockeraBackdropFilter}
				>
					<BackdropFilter
						backdropFilter={values.blockeraBackdropFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraBackdropFilter.default}
						{...extensionProps.blockeraBackdropFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBlendMode}
					config={extensionConfig.blockeraBlendMode}
				>
					<Blending
						blendMode={values.blockeraBlendMode}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraBlendMode.default}
						{...extensionProps.blockeraBlendMode}
					/>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
