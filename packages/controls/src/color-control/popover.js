/**
 * WordPress dependencies
 */
import { Popover, ColorPicker } from '@wordpress/components';

export function ColorPickerPopover({
	element,
	onChange,
	isOpenColorPicker,
	onClose = () => {},
}) {
	return (
		<Popover
			placement="left-start"
			offset={20}
			className="components-palette-edit__popover"
			onClose={onClose}
		>
			{isOpenColorPicker && (
				<ColorPicker
					enableAlpha={false}
					color={element.color}
					onChange={(newColor) => onChange(newColor)}
				/>
			)}
		</Popover>
	);
}
