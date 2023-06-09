/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorIndicator } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { ColorPickerPopover } from './popover';
import { Button } from '@publisher/components';

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
					'color-indicator',
					'color-type-' + type,
					'toggle-focus',
					isOpen ? 'is-focus' : '',
					className
				)}
				onClick={() => setOpen(!isOpen)}
				{...props}
			>
				<ColorIndicator
					colorValue={color}
					className="color-indicator"
				/>

				{label}
			</Button>

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
		</>
	);
}
