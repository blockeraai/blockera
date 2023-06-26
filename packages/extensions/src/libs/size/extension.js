/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ToggleSelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';

export function SizeExtension({ children, config, ...props }) {
	const {
		sizeConfig: { publisherWidth, publisherHeight, publisherOverflow },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherWidth) && (
				<InputField
					{...{
						...props,
						label: __('Width', 'publisher-core'),
						settings: {
							type: 'css',
							unitType: 'essential',
							min: 0,
							defaultValue: '',
						},
						//
						value: attributes.publisherWidth,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherWidth: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherHeight) && (
				<InputField
					{...{
						...props,
						label: __('Height', 'publisher-core'),
						settings: {
							type: 'css',
							unitType: 'essential',
							min: 0,
							defaultValue: '',
						},
						//
						value: attributes.publisherHeight,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherHeight: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherOverflow) && (
				<ToggleSelectField
					label={__('Overflow', 'publisher-core')}
					options={[
						{
							label: __('Visible', 'publisher-core'),
							value: 'visible',
							icon: <OverflowVisibleIcon />,
						},
						{
							label: __('Hidden', 'publisher-core'),
							value: 'hidden',
							icon: <OverflowHiddenIcon />,
						},
						{
							label: __('Scroll', 'publisher-core'),
							value: 'scroll',
							icon: <OverflowScrollIcon />,
						},
					]}
					//
					defaultValue="visible"
					value={attributes.publisherOverflow}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherOverflow: newValue,
						})
					}
				/>
			)}
		</>
	);
}
