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

export default function OutlineControl({
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('outline', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			maxItems={1}
			{...props}
		/>
	);
}

OutlineControl.propTypes = {
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: PropTypes.shape({
		width: PropTypes.string,
		style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
		color: PropTypes.string,
		offset: PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

OutlineControl.defaultProps = {
	defaultRepeaterItemValue: {
		width: '2px',
		style: 'solid',
		color: '#b6b6b6',
		offset: '2px',
		isVisible: true,
	},
	popoverLabel: __('Outline', 'publisher-core'),
};
