/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	ColorField,
	Field,
	IconField,
	InputField,
	ToggleSelectField,
	LinkField,
} from '@publisher/fields';
import { ControlContextProvider } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as PositionLeftIcon } from './icons/position-left';
import { default as PositionRightIcon } from './icons/position-right';

export function IconExtension({ children, config, ...props }) {
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
						name: generateExtensionId(props, 'icon'),
						value: attributes.publisherIcon,
					}}
				>
					<IconField
						{...props}
						label=""
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
				</ControlContextProvider>
			)}

			{isActiveField(publisherIconOptions) && (
				<>
					<Field
						label={__('Style', 'publisher-core')}
						columns="1fr 3fr"
					>
						{isActiveField(publisherIconPosition) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'icon-position'
									),
									value: attributes.publisherIconPosition,
								}}
							>
								<ToggleSelectField
									label={__('Position', 'publisher-core')}
									options={[
										{
											label: __('Left', 'publisher-core'),
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
							</ControlContextProvider>
						)}

						{isActiveField(publisherIconGap) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'icon-gap'
									),
									value: attributes.publisherIconGap,
								}}
							>
								<InputField
									{...props}
									label={__('Gap', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'essential',
										defaultValue: '',
										min: 8,
									}}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherIconGap: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherIconSize) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'icon-size'
									),
									value: attributes.publisherIconSize,
								}}
							>
								<InputField
									{...props}
									label={__('Size', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'essential',
										defaultValue: '',
										min: 8,
									}}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherIconSize: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherIconColor) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'icon-color'
									),
									value: attributes.publisherIconColor,
								}}
							>
								<ColorField
									{...props}
									label={__('Color', 'publisher-core')}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherIconColor: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}
					</Field>

					{isActiveField(publisherIconLink) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(props, 'icon-link'),
								value: attributes.publisherIconLink,
							}}
						>
							<LinkField
								{...props}
								label={__('Link', 'publisher-core')}
								columns="1fr 3fr"
								id={generateExtensionId(props, 'icon-link')}
								//
								onChange={(newValue) => {
									setAttributes({
										...attributes,
										publisherIconLink: newValue,
									});
								}}
							/>
						</ControlContextProvider>
					)}
				</>
			)}
		</>
	);
}
