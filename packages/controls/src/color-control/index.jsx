/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorIndicator } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { ColorPickerPopover } from './popover';

/**
 * Internal dependencies
 */
import './style.scss';

export default function ColorControl({
	color,
	onChange,
	isOpenColorPicker,
	toggleOpenColorPicker,
}) {
	return (
		<>
			<div className="publisher-core-color-picker-control">
				<ColorIndicator
					colorValue={color}
					onClick={() => toggleOpenColorPicker(true)}
				/>
				{__('Color', 'publisher')}
			</div>
			<ColorPickerPopover
				isOpenColorPicker={isOpenColorPicker}
				onClose={() => {
					toggleOpenColorPicker(false);
				}}
				element={{ color: 'transparent' }}
				onChange={(color) => onChange('color', color)}
			/>
		</>
	);
}
