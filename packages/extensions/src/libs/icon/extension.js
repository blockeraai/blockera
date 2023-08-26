/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	LinkControl,
	ColorControl,
	InputControl,
	ToggleSelectControl,
	ControlContextProvider,
	IconControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as PositionLeftIcon } from './icons/position-left';
import { default as PositionRightIcon } from './icons/position-right';

export function IconExtension({ block, children, config, ...props }) {
	const {
		iconConfig: {
			publisherIcon,
			publisherIconOptions,
			publisherIconPosition,
			publisherIconGap,
			publisherIconSize,
			publisherIconColor,
			publisherIconLink,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherIcon) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'icon'),
						value: attributes.publisherIcon,
					}}
				>
					<BaseControl controlName="icon" columns="columns-1">
						<IconControl
							{...props}
							suggestionsQuery={() => {
								return 'button';
							}}
							onChange={(newValue) => {
								setAttributes({
									...attributes,
									publisherIcon: newValue,
								});
							}}
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
									value: attributes.publisherIconPosition,
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
											setAttributes({
												...attributes,
												publisherIconPosition: newValue,
											})
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
									value: attributes.publisherIconGap,
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
												setAttributes({
													...attributes,
													publisherIconGap: newValue,
												}),
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
									value: attributes.publisherIconSize,
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
												setAttributes({
													...attributes,
													publisherIconSize: newValue,
												}),
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
									value: attributes.publisherIconColor,
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
											setAttributes({
												...attributes,
												publisherIconColor: newValue,
											})
										}
									/>
								</BaseControl>
							</ControlContextProvider>
						)}
					</BaseControl>

					{isActiveField(publisherIconLink) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'icon-link'),
								value: attributes.publisherIconLink,
							}}
						>
							<BaseControl
								controlName="link"
								columns="1fr 3fr"
								label={__('Link', 'publisher-core')}
							>
								<LinkControl
									{...props}
									id={generateExtensionId(block, 'icon-link')}
									//
									onChange={(newValue) => {
										setAttributes({
											...attributes,
											publisherIconLink: newValue,
										});
									}}
								/>
							</BaseControl>
						</ControlContextProvider>
					)}
				</>
			)}
		</>
	);
}
