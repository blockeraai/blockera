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
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';

export default function BoxShadowControl({
	id,
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}) {
	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('box-shadow', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}

BoxShadowControl.propTypes = {
	/**
	 * The control identifier
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: PropTypes.shape({
		type: PropTypes.oneOf(['outer', 'inner']),
		x: PropTypes.string,
		y: PropTypes.string,
		blur: PropTypes.string,
		spread: PropTypes.string,
		color: PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

BoxShadowControl.defaultProps = {
	defaultValue: [],
	defaultRepeaterItemValue: {
		type: 'outer',
		x: '0px',
		y: '0px',
		blur: '0px',
		spread: '0px',
		color: '',
		isVisible: true,
	},
	popoverLabel: __('Box Shadow', 'publisher-core'),
};
