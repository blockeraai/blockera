/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Popover, Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as ColorPicker } from './color-picker';

export default function ColorPickerPopover({
	isOpen,
	element,
	onClose = () => {},
	onChange = () => {},
	...props
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
						value={element.color}
						onValueChange={(color) => {
							onChange(color);
						}}
						{...props}
					/>

					<Button onClick={() => onChange('')}>Clear</Button>
				</Popover>
			)}
		</>
	);
}
