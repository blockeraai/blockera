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
	InputControl,
	SelectControl,
	FilterControl,
	TransformControl,
	TransitionControl,
	ToggleSelectControl,
	ControlContextProvider,
	convertAlignmentMatrixCoordinates,
	AlignmentMatrixControl,
} from '@publisher/controls';
import { isInteger } from '@publisher/utils';
import { Button, Popover, Flex } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId, hasSameProps } from '../utils';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';
import OriginCustom from './icons/origin/custom';
import OriginTopLeft from './icons/origin/top-left';
import OriginTopCenter from './icons/origin/top-center';
import OriginTopRight from './icons/origin/top-right';
import OriginCenterLeft from './icons/origin/center-left';
import OriginCenter from './icons/origin/center';
import OriginCenterRight from './icons/origin/center-right';
import OriginBottomLeft from './icons/origin/bottom-left';
import OriginBottomCenter from './icons/origin/bottom-center';
import OriginBottomRight from './icons/origin/bottom-right';
import Back from './icons/origin/back';

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
			},
		} = config;

		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		const [isSelfOriginVisible, setIsSelfOriginVisible] = useState(false);
		const [isChildOriginVisible, setIsChildOriginVisible] = useState(false);

		const [isSelfOriginEdited, setIsSelfOriginEdited] = useState(false);
		const [isChildOriginEdited, setIsChildOriginEdited] = useState(false);

		return (
			<>
				{isActiveField(publisherOpacity) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'opacity'),
							value: opacity,
						}}
					>
						<InputControl
							controlName="input"
							label={__('Opacity', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'percent',
								range: true,
								min: 0,
								max: 100,
								initialPosition: 100,
								defaultValue: '100%',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherOpacity',
										isInteger(newValue)
											? `${newValue}%`
											: newValue
									),
							}}
						/>
					</ControlContextProvider>
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
									value={transform}
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
									<Popover
										title={__(
											'Transform Settings',
											'publisher-core'
										)}
										offset={35}
										placement="left-start"
										className={controlInnerClassNames(
											'transform-settings-popover'
										)}
										onClose={() => {
											setIsTransformSettingsVisible(
												false
											);
										}}
									>
										<BaseControl columns="columns-2">
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'self-perspective'
													),
													value: transformSelfPerspective,
												}}
											>
												<Flex
													justifyContent="flex-start"
													alignItems="stretch"
													gap="10px"
													style={{ height: '30px' }}
												>
													<InputControl
														controlName="input"
														label={__(
															'Self Perspective',
															'publisher-core'
														)}
														columns="columns-2"
														{...{
															...props,
															unitType:
																'essential',
															range: true,
															min: 0,
															max: 2000,
															initialPosition: 100,
															defaultValue: '0px',
															onChange: (
																newValue
															) =>
																handleOnChangeAttributes(
																	'publisherTransformSelfPerspective',
																	newValue
																),
														}}
													/>
													<Button
														label={__(
															'Origin Self',
															'publisher-core'
														)}
														onClick={() => {
															setIsSelfOriginVisible(
																!isSelfOriginVisible
															);
														}}
														size="small"
														style={{
															padding: '6px',
															color: isSelfOriginEdited
																? 'var(--publisher-controls-border-color-focus)'
																: '',
														}}
													>
														{OriginIcon(
															transformSelfOrigin?.top,
															transformSelfOrigin?.left
														)}
													</Button>
												</Flex>
											</ControlContextProvider>

											{isSelfOriginVisible && (
												<Popover
													title={
														<>
															<Button
																label={__(
																	'Back',
																	'publisher-core'
																)}
																align="center"
																style={{
																	width: '26px',
																	height: '26px',
																	padding:
																		'3px',
																}}
																tabIndex="-1"
															>
																<Back />
															</Button>
															{__(
																'Perspective Position',
																'publisher-core'
															)}
														</>
													}
													offset={40}
													placement="left"
													className={controlInnerClassNames(
														'origin-self-popover'
													)}
													onClose={() => {
														setIsSelfOriginVisible(
															false
														);
													}}
												>
													<ControlContextProvider
														value={{
															name: generateExtensionId(
																block,
																'self-origin'
															),
															value: {
																...transformSelfOrigin,
																coordinates:
																	convertAlignmentMatrixCoordinates(
																		transformSelfOrigin
																	)?.compact,
															},
														}}
													>
														<AlignmentMatrixControl
															label={__(
																'Self Origin',
																'publisher-core'
															)}
															columns="columns-2"
															inputFields={true}
															onChange={({
																top,
																left,
															}) => {
																if (
																	top !==
																		'50%' ||
																	left !==
																		'50%' ||
																	transformSelfOrigin.top !==
																		'50%' ||
																	transformSelfOrigin.left !==
																		'50%'
																) {
																	setIsSelfOriginEdited(
																		true
																	);
																}

																handleOnChangeAttributes(
																	'publisherTransformSelfOrigin',
																	{
																		...transformSelfOrigin,
																		top,
																		left,
																	}
																);
															}}
														/>
													</ControlContextProvider>
												</Popover>
											)}
										</BaseControl>

										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'backface-visibility'
												),
												value: backfaceVisibility,
											}}
										>
											<ToggleSelectControl
												controlName="toggle-select"
												label={__(
													'Backface Visibility',
													'publisher-core'
												)}
												columns="columns-2"
												options={[
													{
														label: __(
															'Visible',
															'publisher-core'
														),
														value: 'visible',
													},
													{
														label: __(
															'Hidden',
															'publisher-core'
														),
														value: 'hidden',
													},
												]}
												defaultValue="visible"
												onChange={(newValue) =>
													handleOnChangeAttributes(
														'publisherBackfaceVisibility',
														newValue
													)
												}
											/>
										</ControlContextProvider>

										<BaseControl columns="columns-2">
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'child-perspective'
													),
													value: transformChildPerspective
														? transformChildPerspective
														: '0px',
												}}
											>
												<Flex
													justifyContent="flex-start"
													alignItems="stretch"
													gap="10px"
													style={{ height: '30px' }}
												>
													<InputControl
														controlName="input"
														label={__(
															'Child Perspective',
															'publisher-core'
														)}
														columns="columns-2"
														{...{
															...props,
															unitType:
																'essential',
															range: true,
															min: 0,
															max: 2000,
															defaultValue: '0px',
															onChange: (
																newValue
															) =>
																handleOnChangeAttributes(
																	'publisherTransformChildPerspective',
																	newValue
																),
														}}
													/>
													<Button
														onClick={() => {
															setIsChildOriginVisible(
																!isChildOriginVisible
															);
														}}
														label={__(
															'Origin Child',
															'publisher-core'
														)}
														size="small"
														style={{
															padding: '6px',
															color: isChildOriginEdited
																? 'var(--publisher-controls-border-color-focus)'
																: '',
														}}
													>
														{OriginIcon(
															transformChildOrigin.top,
															transformChildOrigin.left
														)}
													</Button>
												</Flex>
											</ControlContextProvider>

											{isChildOriginVisible && (
												<Popover
													title={
														<>
															<Button
																label={__(
																	'Back',
																	'publisher-core'
																)}
																align="center"
																style={{
																	width: '26px',
																	height: '26px',
																	padding:
																		'3px',
																}}
																tabIndex="-1"
															>
																<Back />
															</Button>
															{__(
																'Perspective Position',
																'publisher-core'
															)}
														</>
													}
													offset={40}
													placement="left"
													className={controlInnerClassNames(
														'origin-child-popover'
													)}
													onClose={() => {
														setIsChildOriginVisible(
															false
														);
													}}
												>
													<ControlContextProvider
														value={{
															name: generateExtensionId(
																block,
																'child-origin'
															),
															value: {
																top: transformChildOrigin?.top,
																left: transformChildOrigin?.left,
																coordinates:
																	convertAlignmentMatrixCoordinates(
																		transformChildOrigin
																	)?.compact,
															},
														}}
													>
														<AlignmentMatrixControl
															label={__(
																'Child Origin',
																'publisher-core'
															)}
															columns="columns-2"
															inputFields={true}
															onChange={({
																top,
																left,
															}) => {
																if (
																	top !==
																		'50%' ||
																	left !==
																		'50%' ||
																	transformSelfOrigin.top !==
																		'50%' ||
																	transformSelfOrigin.left !==
																		'50%'
																) {
																	setIsChildOriginEdited(
																		true
																	);
																}

																handleOnChangeAttributes(
																	'publisherTransformChildOrigin',
																	{
																		...transformChildOrigin,
																		top,
																		left,
																	}
																);
															}}
														/>
													</ControlContextProvider>
												</Popover>
											)}
										</BaseControl>
									</Popover>
								)}
							</BaseControl>
						</ControlContextProvider>
					</>
				)}

				{isActiveField(publisherTransition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transition'),
							value: transition,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="transition"
							columns="columns-1"
						>
							<TransitionControl
								label={__('Transitions', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherTransition',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherFilter) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'filters'),
							value: filter,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl controlName="filter" columns="columns-1">
							<FilterControl
								label={__('Filters', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFilter',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackdropFilter) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'backdrop-filters'
							),
							value: backdropFilter,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl columns="columns-1" controlName="filter">
							<FilterControl
								label={__('Backdrop Filters', 'publisher-core')}
								popoverLabel={__(
									'Backdrop Filter',
									'publisher-core'
								)}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBackdropFilter',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherCursor) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'cursor'),
							value: cursor,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Cursor', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								options: cursorFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'default',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherCursor',
										newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBlendMode) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'blend-mode'),
							value: blendMode,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Blending', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								options: blendModeFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'normal',
								value: blendMode,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherBlendMode',
										newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);

const OriginIcon = (top: string, left: string) => {
	if (top === '0%' && left === '0%') return <OriginTopLeft />;
	if (top === '0%' && left === '50%') return <OriginTopCenter />;
	if (top === '0%' && left === '100%') return <OriginTopRight />;
	if (top === '50%' && left === '0%') return <OriginCenterLeft />;
	if (top === '50%' && left === '50%') return <OriginCenter />;
	if (top === '50%' && left === '100%') return <OriginCenterRight />;
	if (top === '100%' && left === '0%') return <OriginBottomLeft />;
	if (top === '100%' && left === '50%') return <OriginBottomCenter />;
	if (top === '100%' && left === '100%') return <OriginBottomRight />;
	return <OriginCustom />;
};
