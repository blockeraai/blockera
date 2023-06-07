/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorIndicator } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { ColorPickerPopover } from './popover';

export default function ColorControl({
	value,
	//
	onValueChange = () => {},
	className,
	...props
}) {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState(value);

	return (
		<div
			className={controlClassNames(
				'color',
				isOpen ? 'color-picker-open' : '',
				className
			)}
		>
			<div
				className={controlInnerClassNames('color-indicator')}
				onClick={() => setOpen(!isOpen)}
			>
				<ColorIndicator
					colorValue={color}
					className="color-indicator"
				/>
				{color || __('None', 'publisher-core')}
			</div>

			<ColorPickerPopover
				onClose={() => setOpen(false)}
				{...{
					...props,
					isOpen,
					element: { color: color || 'transparent' },
				}}
				value={color}
				onChange={(color) => {
					setColor(color);

					onValueChange(color);
				}}
			/>
		</div>
	);
}
