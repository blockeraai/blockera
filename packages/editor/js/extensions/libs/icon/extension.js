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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId } from '../utils';
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
		values: {
			blockeraIcon: icon,
			blockeraIconGap: iconGap,
			blockeraIconSize: iconSize,
			blockeraIconLink: iconLink,
			blockeraIconColor: iconColor,
			blockeraIconPosition: iconPosition,
		},
		handleOnChangeAttributes,
		extensionProps,
	}: TIconProps): MixedElement => {
		return (
			<PanelBodyControl
				title={__('Icon', 'blockera')}
				initialOpen={true}
				icon={<Icon icon="extension-icon" />}
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
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraIcon',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraIcon}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(blockeraIconOptions) && (
					<>
						<BaseControl
							label={__('Style', 'blockera')}
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
										label={__('Position', 'blockera')}
										columns="columns-2"
										options={[
											{
												label: __('Left', 'blockera'),
												value: 'left',
												icon: (
													<Icon
														icon="icon-position-left"
														iconSize="18"
													/>
												),
											},
											{
												label: __('Right', 'blockera'),
												value: 'right',
												icon: (
													<Icon
														icon="icon-position-right"
														iconSize="18"
													/>
												),
											},
										]}
										isDeselectable={true}
										//
										defaultValue=""
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraIconPosition',
												newValue,
												{ ref }
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
										label={__('Gap', 'blockera')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={0}
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraIconGap',
												newValue,
												{ ref }
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
										label={__('Size', 'blockera')}
										columns="columns-2"
										unitType="essential"
										defaultValue=""
										min={8}
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraIconSize',
												newValue,
												{ ref }
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
										label={__('Color', 'blockera')}
										columns="columns-2"
										//
										defaultValue=""
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraIconColor',
												newValue,
												{ ref }
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
									label={__('Link', 'blockera')}
									id={generateExtensionId(block, 'icon-link')}
									//
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraIconLink',
											newValue,
											{ ref }
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
