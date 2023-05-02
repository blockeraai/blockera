/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorIndicator } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { ColorPickerPopover } from './popover';

/**
 * Internal dependencies
 */
import './style.scss';

export default function ColorControl({
	color,
	className = 'color-control',
	...props
}) {
	const [isOpen, setOpen] = useState(false);

	return (
		<div className={controlClassNames(className)}>
			<div className="color-indicator-with-label">
				<ColorIndicator
					colorValue={color}
					className="color-indicator"
					onClick={() => setOpen(true)}
				/>
				{__('Color', 'publisher')}
			</div>
			<ColorPickerPopover
				onClose={() => setOpen(false)}
				{...{ ...props, isOpen, element: { color: color || 'transparent' } }}
			/>
		</div>
	);
}
