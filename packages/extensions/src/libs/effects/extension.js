// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	TransformControl,
	ControlContextProvider,
} from '@publisher/controls';
import { isInteger } from '@publisher/utils';
import { Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

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
import { Cursor } from './components/cursor';
import { Blending } from './components/blending';
import { Mask } from './components/mask';

export const EffectsExtension: TEffectsProps = memo<TEffectsProps>(
	({
		children,
		values: {
			opacity,
			transform,
			transition,
			filter,
			cursor,
			blendMode,
			backdropFilter,
			backfaceVisibility,
			transformSelfOrigin,
			transformChildOrigin,
			transformSelfPerspective,
			transformChildPerspective,
			mask,
		},
		block,
		config,
		handleOnChangeAttributes,
		...props
	}: TEffectsProps): MixedElement => {
		const {
			effectsConfig: {
				publisherOpacity,
				publisherTransform,
				publisherTransition,
				publisherFilter,
				publisherCursor,
				publisherBlendMode,
				publisherBackdropFilter,
				publisherMask,
			},
		} = config;

		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		return (
			<>
				{isActiveField(publisherOpacity) && (
					<Opacity
						block={block}
						opacity={opacity}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
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
									label={__(
										'2D & 3D Transforms',
										'publisher-core'
									)}
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
									{...props}
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
										props={props}
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
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}

				{isActiveField(publisherFilter) && (
					<Filter
						filter={filter}
						block={block}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}

				{isActiveField(publisherBackdropFilter) && (
					<BackdropFilter
						backdropFilter={backdropFilter}
						block={block}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}

				{isActiveField(publisherMask) && (
					<Mask
						mask={mask}
						block={block}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}

				{isActiveField(publisherCursor) && (
					<Cursor
						cursor={cursor}
						block={block}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}

				{isActiveField(publisherBlendMode) && (
					<Blending
						blendMode={blendMode}
						block={block}
						props={props}
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				)}
			</>
		);
	},
	hasSameProps
);
