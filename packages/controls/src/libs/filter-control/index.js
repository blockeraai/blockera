/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';

export default function FilterControl({
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}) {
	// todo value cleanup

	return (
		<RepeaterControl
			className={controlClassNames('filter', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}

FilterControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * The current value.
	 */
	value: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: PropTypes.shape({
		type: PropTypes.oneOf([
			'blur',
			'drop-shadow',
			'brightness',
			'contrast',
			'hue-rotate',
			'saturate',
			'grayscale',
			'invert',
			'sepia',
		]),
		blur: PropTypes.string,
		brightness: PropTypes.string,
		contrast: PropTypes.string,
		'hue-rotate': PropTypes.string,
		saturate: PropTypes.string,
		grayscale: PropTypes.string,
		invert: PropTypes.string,
		sepia: PropTypes.string,
		'drop-shadow-x': PropTypes.string,
		'drop-shadow-y': PropTypes.string,
		'drop-shadow-blur': PropTypes.string,
		'drop-shadow-color': PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

FilterControl.defaultProps = {
	value: [],
	defaultRepeaterItemValue: {
		type: 'blur',
		blur: '3px',
		brightness: '200%',
		contrast: '200%',
		'hue-rotate': '45deg',
		saturate: '200%',
		grayscale: '100%',
		invert: '100%',
		sepia: '100%',
		'drop-shadow-x': '10px',
		'drop-shadow-y': '10px',
		'drop-shadow-blur': '10px',
		'drop-shadow-color': '',
		isVisible: true,
	},
	popoverLabel: __('Filter Effect', 'publisher-core'),
};
