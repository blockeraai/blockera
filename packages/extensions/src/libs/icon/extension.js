// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	IconControl,
	LinkControl,
	ColorControl,
	InputControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { default as PositionLeftIcon } from './icons/position-left';
import { generateExtensionId, hasSameProps } from '../utils';
import { default as PositionRightIcon } from './icons/position-right';
import type { TIconProps } from './types/icon-extension-props';

export const IconExtension: MixedElement = memo<TIconProps>(
	({
		block,
		config,
		children,
		values: { icon, iconGap, iconSize, iconLink, iconColor, iconPosition },
		handleOnChangeAttributes,
		...props
	}: TIconProps): MixedElement => {
		const {
			iconConfig: {
				publisherIcon,
				publisherIconGap,
				publisherIconSize,
				publisherIconLink,
				publisherIconColor,
				publisherIconOptions,
				publisherIconPosition,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherIcon) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'icon'),
							value: icon,
						}}
					>
						<BaseControl controlName="icon" columns="columns-1">
							<IconControl
								{...props}
								suggestionsQuery={() => {
									return 'button';
								}}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherIcon',
										newValue
									)
								}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherIconOptions) && (
					<>
						<BaseControl
							label={__('Style', 'publisher-core')}
							columns="1fr 3fr"
						>
							{isActiveField(publisherIconPosition) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-position'
										),
										value: iconPosition,
									}}
								>
									<BaseControl
										controlName="toggle-select"
										label={__('Position', 'publisher-core')}
									>
										<ToggleSelectControl
											options={[
												{
													label: __(
														'Left',
														'publisher-core'
													),
													value: 'left',
													icon: <PositionLeftIcon />,
												},
												{
													label: __(
														'Right',
														'publisher-core'
													),
													value: 'right',
													icon: <PositionRightIcon />,
												},
											]}
											isDeselectable={true}
											//
											defaultValue=""
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherIconPosition',
													newValue
												)
											}
										/>
									</BaseControl>
								</ControlContextProvider>
							)}

							{isActiveField(publisherIconGap) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-gap'
										),
										value: iconGap,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Gap', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												unitType: 'essential',
												defaultValue: '',
												min: 8,
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherIconGap',
														newValue
													),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
							)}

							{isActiveField(publisherIconSize) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-size'
										),
										value: iconSize,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Size', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												unitType: 'essential',
												defaultValue: '',
												min: 8,
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherIconSize',
														newValue
													),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
							)}

							{isActiveField(publisherIconColor) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-color'
										),
										value: iconColor,
									}}
								>
									<BaseControl
										controlName="color"
										label={__('Color', 'publisher-core')}
									>
										<ColorControl
											{...props}
											//
											defaultValue=""
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherIconColor',
													newValue
												)
											}
										/>
									</BaseControl>
								</ControlContextProvider>
							)}
						</BaseControl>

						{isActiveField(publisherIconLink) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'icon-link'
									),
									value: iconLink,
								}}
							>
								<BaseControl
									controlName="link"
									columns="1fr 3fr"
									label={__('Link', 'publisher-core')}
								>
									<LinkControl
										{...props}
										id={generateExtensionId(
											block,
											'icon-link'
										)}
										//
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherIconLink',
												newValue
											)
										}
									/>
								</BaseControl>
							</ControlContextProvider>
						)}
					</>
				)}

				{children}
			</>
		);
	},
	hasSameProps
);
