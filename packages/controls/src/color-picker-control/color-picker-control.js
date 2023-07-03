/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { useValue } from '@publisher/utils';

import { Button, Popover } from '@publisher/components';

export default function ColorPickerControl({
	popoverTitle,
	isOpen,
	onClose,
	onChange,
	placement,
	isPopover = true,
	value: initialValue,
	defaultValue,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
		valueCleanup,
	});

	// make sure always we treat colors as lower case
	function valueCleanup(value) {
		if (value !== '') {
			value = value.toLowerCase();
		}

		return value;
	}

	if (isPopover) {
		return (
			<>
				{isOpen && (
					<Popover
						title={popoverTitle}
						offset={20}
						placement={placement}
						className="components-palette-edit-popover"
						onClose={onClose}
					>
						<WPColorPicker
							enableAlpha={false}
							color={value}
							onChangeComplete={(color) => setValue(color.hex)}
							{...props}
						/>

						<Button onClick={() => onChange('')}>
							{__('Clear', 'publisher-core')}
						</Button>
					</Popover>
				)}
			</>
		);
	}

	return (
		<WPColorPicker
			enableAlpha={false}
			color={value}
			onChangeComplete={(color) => setValue(color.hex)}
			{...props}
		/>
	);
}

ColorPickerControl.propTypes = {
	/**
	 * is ColorPicker popover open  by default or not?
	 */
	isOpen: PropTypes.bool,
	/**
	 * Popover title
	 */
	popoverTitle: PropTypes.string,
	/**
	 * Popover placement
	 */
	placement: PropTypes.string,
	/**
	 * event that will be fired while closing popover
	 */
	onClose: PropTypes.func,
	/**
	 * event that will be fired while changing the color picker value
	 */
	onChange: PropTypes.func,
};

ColorPickerControl.defaultProps = {
	popoverTitle: __('Color Picker', 'publisher-core'),
	isPopover: true,
	value: '',
	defaultValue: '',
	isOpen: false,
	placement: 'left-start',
	onClose: () => {},
	onChange: () => {},
};
