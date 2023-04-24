/**
 * WordPress dependencies
 */
import { Popover, ColorPicker } from '@wordpress/components';

export function ColorPickerPopover({
	isOpen,
	element,
	onClose = () => {},
	onChange = () => {},
}) {
	return (
		<Popover
			offset={20}
			placement="left-start"
			className="components-palette-edit-popover"
			onClose={onClose}
		>
			{isOpen && (
				<ColorPicker
					enableAlpha={false}
					color={element.color}
					onChangeComplete={(color) => onChange(color.hex)}
				/>
			)}
		</Popover>
	);
}
