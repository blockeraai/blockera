/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function LabelControl({
	label,
	className,
	ariaLabel,
	...props
}) {
	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
				>
					{label}
				</span>
			)}
		</>
	);
}

LabelControl.propTypes = {
	/**
	 * Label text
	 */
	label: PropTypes.string,
	/**
	 * Custom css classes
	 */
	className: PropTypes.string,
	/**
	 * Custom aria label for adding to label tag
	 */
	ariaLabel: PropTypes.string,
};

LabelControl.defaultProps = {
	label: '',
	ariaLabel: '',
};
