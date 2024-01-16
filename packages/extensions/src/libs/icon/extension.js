// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	IconControl,
	LinkControl,
	ColorControl,
	InputControl,
	PanelBodyControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { IconExtensionIcon } from './index';
import { isActiveField } from '../../api/utils';
import { default as PositionLeftIcon } from './icons/position-left';
import { generateExtensionId, hasSameProps } from '../utils';
import { default as PositionRightIcon } from './icons/position-right';
import type { TIconProps } from './types/icon-extension-props';

export const IconExtension: ComponentType<TIconProps> = memo(
	({
		block,
		iconConfig: {
			publisherIcon,
			publisherIconGap,
			publisherIconSize,
			publisherIconLink,
			publisherIconColor,
			publisherIconOptions,
			publisherIconPosition,
		},
		values: { icon, iconGap, iconSize, iconLink, iconColor, iconPosition },
		handleOnChangeAttributes,
		extensionProps,
	}: TIconProps): MixedElement => {
		return (
			<PanelBodyControl
				title={__('Icon', 'publisher-core')}
				initialOpen={true}
				icon={<IconExtensionIcon />}
				className={componentClassNames('extension', 'extension-icon')}
			>
				{isActiveField(publisherIcon) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'icon'),
							value: icon,
							attribute: 'publisherIcon',
							blockName: block.blockName,
						}}
					>
						<IconControl
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
							{...extensionProps.publisherIcon}
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
										attribute: 'publisherIconPosition',
										blockName: block.blockName,
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
										{...extensionProps.publisherIconPosition}
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
										attribute: 'publisherIconGap',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Gap', 'publisher-core')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={0}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherIconGap',
												newValue
											)
										}
										{...extensionProps.publisherIconGap}
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
										attribute: 'publisherIconSize',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Size', 'publisher-core')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={8}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherIconSize',
												newValue
											)
										}
										{...extensionProps.publisherIconSize}
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
										attribute: 'publisherIconColor',
										blockName: block.blockName,
									}}
								>
									<ColorControl
										controlName="color"
										label={__('Color', 'publisher-core')}
										columns="columns-2"
										//
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherIconColor',
												newValue
											)
										}
										{...extensionProps.publisherIconColor}
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
									attribute: 'publisherIconLink',
									blockName: block.blockName,
								}}
							>
								<LinkControl
									controlName="link"
									columns="1fr 3fr"
									label={__('Link', 'publisher-core')}
									id={generateExtensionId(block, 'icon-link')}
									//
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherIconLink',
											newValue
										)
									}
									{...extensionProps.publisherIconLink}
								/>
							</ControlContextProvider>
						)}
					</>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
