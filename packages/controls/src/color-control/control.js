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
import { ColorPickerControl } from '../index';
import PropTypes from 'prop-types';
import { useValue } from '@publisher/utils';

export default function ColorControl({
	type,
	defaultValue,
	value: initialValue,
	onChange,
	noBorder,
	contentAlign,
	//
	className,
	style,
	...props
}) {
	const { value, setValue } = useValue({
		defaultValue,
		initialValue,
		onChange,
	});

	const [isOpen, setOpen] = useState(false);

	let label = '';

	if (type === 'normal') {
		label = value ? (
			<span className="color-label">{value}</span>
		) : (
			<span className="color-label">{__('None', 'publisher-core')}</span>
		);
	}

	return (
		<>
			<Button
				size="input"
				className={controlClassNames(
					'color',
					'color-type-' + type,
					value ? 'is-not-empty' : 'is-empty',
					className
				)}
				noBorder={noBorder || type === 'minimal'}
				isFocus={isOpen}
				contentAlign={type === 'minimal' ? 'center' : contentAlign}
				onClick={() => setOpen(!isOpen)}
				style={{
					...style,
					'--publisher-controls-border-color-focus': value,
				}}
				{...props}
			>
				<ColorIndicator type="color" value={value} />

				{label}
			</Button>

			{isOpen && (
				<ColorPickerControl
					isPopover={true}
					isOpen={isOpen}
					onClose={() => setOpen(false)}
					onChange={setValue}
					value={value}
					{...props}
				/>
			)}
		</>
	);
}

ColorControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * Type of CSS units from presets
	 */
	type: PropTypes.oneOf(['normal', 'minimal']),
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign: PropTypes.oneOf(['left', 'center', 'right']),
};

ColorControl.defaultProps = {
	type: 'normal',
	contentAlign: 'left',
};
