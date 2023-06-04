/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorIndicator } from '@wordpress/components';
import { useState, useContext } from '@wordpress/element';


/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';


/**
 * Internal dependencies
 */
import './style.scss';
import { getControlValue, updateControlValue } from './../utils';
import { ColorPickerPopover } from './popover';

export default function ColorControl({
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	onChange = () => { },
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	const [isOpen, setOpen] = useState(false);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		'',
		attributes
	);

	return (
		<div className={controlClassNames('color', className)}>

			<div className="color-indicator-with-label">
				<ColorIndicator
					colorValue={controlValue}
					className="color-indicator"
					onClick={() => setOpen(true)}
				/>
				{controlValue}
			</div>

			<ColorPickerPopover
				onClose={() => setOpen(false)}
				{...{ ...props, isOpen, element: { color: controlValue || 'transparent' } }}

				value={controlValue}
				onChange={(newValue) => {
					updateControlValue(
						newValue,
						attribute,
						repeaterAttribute,
						repeaterAttributeIndex,
						attributes,
						setAttributes
					);

					onChange(newValue);
				}}
			/>
		</div>
	);
}
