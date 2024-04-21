// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
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
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { IconExtensionIcon } from './index';
import { isActiveField } from '../../api/utils';
import { default as PositionLeftIcon } from './icons/position-left';
import { generateExtensionId } from '../utils';
import { default as PositionRightIcon } from './icons/position-right';
import type { TIconProps } from './types/icon-extension-props';

export const IconExtension: ComponentType<TIconProps> = memo(
	({
		block,
		iconConfig: {
			blockeraIcon,
			blockeraIconGap,
			blockeraIconSize,
			blockeraIconLink,
			blockeraIconColor,
			blockeraIconOptions,
			blockeraIconPosition,
		},
		values: { icon, iconGap, iconSize, iconLink, iconColor, iconPosition },
		handleOnChangeAttributes,
		extensionProps,
	}: TIconProps): MixedElement => {
		return (
			<PanelBodyControl
				title={__('Icon', 'blockera-core')}
				initialOpen={true}
				icon={<IconExtensionIcon />}
				className={extensionClassNames('icon')}
			>
				{isActiveField(blockeraIcon) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'icon'),
							value: icon,
							attribute: 'blockeraIcon',
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
									'blockeraIcon',
									newValue
								)
							}
							{...extensionProps.blockeraIcon}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(blockeraIconOptions) && (
					<>
						<BaseControl
							label={__('Style', 'blockera-core')}
							columns="1fr 3fr"
						>
							{isActiveField(blockeraIconPosition) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-position'
										),
										value: iconPosition,
										attribute: 'blockeraIconPosition',
										blockName: block.blockName,
									}}
								>
									<ToggleSelectControl
										controlName="toggle-select"
										label={__('Position', 'blockera-core')}
										columns="columns-2"
										options={[
											{
												label: __(
													'Left',
													'blockera-core'
												),
												value: 'left',
												icon: <PositionLeftIcon />,
											},
											{
												label: __(
													'Right',
													'blockera-core'
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
												'blockeraIconPosition',
												newValue
											)
										}
										{...extensionProps.blockeraIconPosition}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(blockeraIconGap) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-gap'
										),
										value: iconGap,
										attribute: 'blockeraIconGap',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Gap', 'blockera-core')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={0}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'blockeraIconGap',
												newValue
											)
										}
										{...extensionProps.blockeraIconGap}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(blockeraIconSize) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-size'
										),
										value: iconSize,
										attribute: 'blockeraIconSize',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Size', 'blockera-core')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={8}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'blockeraIconSize',
												newValue
											)
										}
										{...extensionProps.blockeraIconSize}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(blockeraIconColor) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-color'
										),
										value: iconColor,
										attribute: 'blockeraIconColor',
										blockName: block.blockName,
									}}
								>
									<ColorControl
										controlName="color"
										label={__('Color', 'blockera-core')}
										columns="columns-2"
										//
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'blockeraIconColor',
												newValue
											)
										}
										{...extensionProps.blockeraIconColor}
									/>
								</ControlContextProvider>
							)}
						</BaseControl>

						{isActiveField(blockeraIconLink) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'icon-link'
									),
									value: iconLink,
									attribute: 'blockeraIconLink',
									blockName: block.blockName,
								}}
							>
								<LinkControl
									controlName="link"
									columns="1fr 3fr"
									label={__('Link', 'blockera-core')}
									id={generateExtensionId(block, 'icon-link')}
									//
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'blockeraIconLink',
											newValue
										)
									}
									{...extensionProps.blockeraIconLink}
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
