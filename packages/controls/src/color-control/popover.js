/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorPicker } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { Popover, Button } from '@publisher/components';

export function ColorPickerPopover({
	isOpen,
	element,
	onClose = () => {},
	onChange = () => {},
}) {
	return (
		<>
			{isOpen && (
				<Popover
					label={__('Color Picker', 'publisher-core')}
					offset={20}
					placement="left-start"
					className="components-palette-edit-popover"
					onClose={onClose}
				>
					<ColorPicker
						enableAlpha={false}
						color={element.color}
						onChangeComplete={(color) => onChange(color.hex)}
					/>

					<Button onClick={() => onChange('')}>Clear</Button>
				</Popover>
			)}
		</>
	);
}
