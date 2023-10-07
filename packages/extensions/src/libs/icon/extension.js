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
						<IconControl
							{...props}
							columns="columns-1"
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
									<ToggleSelectControl
										controlName="toggle-select"
										label={__('Position', 'publisher-core')}
										columns="columns-2"
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
									<InputControl
										controlName="input"
										label={__('Gap', 'publisher-core')}
										columns="columns-2"
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
									<InputControl
										controlName="input"
										label={__('Size', 'publisher-core')}
										columns="columns-2"
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
									<ColorControl
										controlName="color"
										label={__('Color', 'publisher-core')}
										columns="columns-2"
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
								<LinkControl
									controlName="link"
									columns="1fr 3fr"
									label={__('Link', 'publisher-core')}
									{...props}
									id={generateExtensionId(block, 'icon-link')}
									//
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherIconLink',
											newValue
										)
									}
								/>
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
