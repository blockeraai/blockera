/**
 * WordPress dependencies
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

/**
 * Internal dependencies
 */
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
				<IconField
					{...props}
					label=""
					value={attributes.publisherIcon}
					suggestionsQuery={() => {
						return 'button';
					}}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherIcon: newValue,
						});
					}}
				/>
			)}

			{isActiveField(publisherIconOptions) && (
				<>
					<Field
						label={__('Style', 'publisher-core')}
						columns="1fr 3fr"
					>
						{isActiveField(publisherIconPosition) && (
							<ToggleSelectField
								label={__('Position', 'publisher-core')}
								options={[
									{
										label: __('Left', 'publisher-core'),
										value: 'left',
										icon: <PositionLeftIcon />,
									},
									{
										label: __('Right', 'publisher-core'),
										value: 'right',
										icon: <PositionRightIcon />,
									},
								]}
								isDeselectable={true}
								//
								defaultValue=""
								value={attributes.publisherIconPosition}
								onChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherIconPosition: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherIconGap) && (
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
								value={attributes.publisherIconGap}
								onChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherIconGap: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherIconSize) && (
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
								value={attributes.publisherIconSize}
								onChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherIconSize: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherIconColor) && (
							<ColorField
								{...props}
								label={__('Color', 'publisher-core')}
								//
								defaultValue=""
								value={attributes.publisherIconColor}
								onChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherIconColor: newValue,
									})
								}
							/>
						)}
					</Field>

					{isActiveField(publisherIconLink) && (
						<LinkField
							{...props}
							label={__('Link', 'publisher-core')}
							columns="1fr 3fr"
							//
							value={attributes.publisherIconLink}
							onValueChange={(newValue) => {
								setAttributes({
									...attributes,
									publisherIconLink: newValue,
								});
							}}
						/>
					)}
				</>
			)}
		</>
	);
}
