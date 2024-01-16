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
import { Button } from '@publisher/components';
import {
	componentClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
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

export const EffectsExtension: ComponentType<TEffectsProps> = memo(
	({
		values: {
			opacity,
			transform,
			transition,
			filter,
			blendMode,
			backdropFilter,
			backfaceVisibility,
			transformSelfOrigin,
			transformChildOrigin,
			transformSelfPerspective,
			transformChildPerspective,
			divider,
			mask,
		},
		block,
		effectsConfig: {
			publisherOpacity,
			publisherTransform,
			publisherTransition,
			publisherFilter,
			publisherBlendMode,
			publisherBackdropFilter,
			publisherDivider,
			publisherMask,
		},
		handleOnChangeAttributes,
		extensionProps,
	}: TEffectsProps): MixedElement => {
		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

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
				{isActiveField(publisherOpacity) && (
					<Opacity
						block={block}
						opacity={opacity}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherOpacity}
					/>
				)}

				{isActiveField(publisherTransform) && (
					<>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'transform-2d-3d'
								),
								value: transform,
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
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherTransform',
											isInteger(newValue)
												? `${newValue}%`
												: newValue
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
												isFocus={
													isTransformSettingsVisible
												}
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
									{...extensionProps.publisherTransform}
								/>

								{isTransformSettingsVisible && (
									<TransformSettings
										setIsTransformSettingsVisible={
											setIsTransformSettingsVisible
										}
										transformSelfPerspective={
											transformSelfPerspective
										}
										block={block}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										backfaceVisibility={backfaceVisibility}
										transformChildPerspective={
											transformChildPerspective
										}
										transformChildOrigin={
											transformChildOrigin
										}
										transformSelfOrigin={
											transformSelfOrigin
										}
										transform={transform}
									/>
								)}
							</BaseControl>
						</ControlContextProvider>
					</>
				)}

				{isActiveField(publisherTransition) && (
					<Transition
						transition={transition}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherTransition}
					/>
				)}

				{isActiveField(publisherFilter) && (
					<Filter
						filter={filter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherFilter}
					/>
				)}

				{isActiveField(publisherBackdropFilter) && (
					<BackdropFilter
						backdropFilter={backdropFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherBackdropFilter}
					/>
				)}

				{isActiveField(publisherDivider) && (
					<Divider
						divider={divider}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherDivider}
					/>
				)}

				{isActiveField(publisherMask) && (
					<Mask
						mask={mask}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherMask}
					/>
				)}
				{isActiveField(publisherBlendMode) && (
					<Blending
						blendMode={blendMode}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.publisherBlendMode}
					/>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
