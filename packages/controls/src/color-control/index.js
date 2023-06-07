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
	//
	onValueChange = (newValue) => {
		return newValue;
	},
	className,
	...props
}) {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState(value);

	return (
		<>
			<Button
				size="input"
				style="primary"
				className={
					isOpen
						? 'is-focus toggle-focus ' +
						  controlClassNames('color-indicator')
						: 'toggle-focus ' + controlClassNames('color-indicator')
				}
				onClick={() => setOpen(!isOpen)}
			>
				<ColorIndicator
					colorValue={color}
					className="color-indicator"
				/>
				{color || __('None', 'publisher-core')}
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
