/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { ColorIndicator, Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as ColorPickerPopover } from './popover';

export default function ColorControl({
	value,
	type = 'normal',
	//
	onValueChange = (newValue) => {
		return newValue;
	},
	className,
	...props
}) {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState(value);

	let label = '';

	if (type !== 'minimal') {
		label = color || __('None', 'publisher-core');
	}

	return (
		<>
			<Button
				size="input"
				style="primary"
				className={controlClassNames(
					'color',
					'color-type-' + type,
					'toggle-focus',
					isOpen ? 'is-focus' : '',
					className
				)}
				onClick={() => setOpen(!isOpen)}
				{...props}
			>
				<ColorIndicator value={color} />

				{label}
			</Button>

			{isOpen && (
				<ColorPickerPopover
					onClose={() => setOpen(false)}
					{...{
						...props,
						isOpen,
						element: { color: color || 'transparent' },
					}}
					value={color}
					onChange={(newValue) => {
						setColor(newValue);

						onValueChange(newValue);

						return newValue;
					}}
				/>
			)}
		</>
	);
}
