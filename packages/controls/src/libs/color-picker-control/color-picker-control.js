// @flow
/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, ColorIndicator, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import type { MixedElement } from 'react';
import type { Props } from './types';

export default function ColorPickerControl({
	popoverTitle,
	isOpen,
	onClose,
	placement,
	isPopover,
	hasClearBtn,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
	...props
}: Props): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

	// make sure always we treat colors as lower case
	function valueCleanup(value: string) {
		if (value !== '') {
			value = value.toLowerCase();
		}

		return value;
	}

	if (isPopover) {
		return (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
			>
				{isOpen && (
					<Popover
						title={popoverTitle}
						offset={20}
						placement={placement}
						className="components-palette-edit-popover"
						onClose={onClose}
						titleButtonsRight={
							<Button
								tabIndex="-1"
								size={'extra-small'}
								onClick={() => setValue('')}
								style={{ padding: '5px' }}
								aria-label={__(
									'Reset Color (Clear)',
									'publisher-core'
								)}
							>
								<ColorIndicator
									type="color"
									value=""
									size={16}
								/>
							</Button>
						}
					>
						<WPColorPicker
							enableAlpha={false}
							color={value}
							onChangeComplete={(color) => setValue(color.hex)}
							{...props}
						/>
					</Popover>
				)}
			</BaseControl>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<WPColorPicker
				enableAlpha={false}
				color={value}
				onChangeComplete={(color) => setValue(color.hex)}
				{...props}
			/>
			{hasClearBtn && (
				<Button
					onClick={() => setValue('')}
					aria-label={__('Reset Color (Clear)', 'publisher-core')}
				>
					{__('Clear', 'publisher-core')}
				</Button>
			)}
		</BaseControl>
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
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string.isRequired,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};

ColorPickerControl.defaultProps = {
	label: '',
	field: 'color-picker',
	popoverTitle: (__('Color Picker', 'publisher-core'): string),
	isPopover: true,
	defaultValue: '',
	hasClearBtn: true,
	isOpen: false,
	placement: 'left-start',
	onClose: () => {},
};
