/**
 * External dependencies
 */
import { __experimentalAlignmentMatrixControl as WPAlignmentMatrixControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

export default function AlignmentMatrixControl({
	size,
	//
	defaultValue,
	value: initialValue,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onValueChange,
	});

	return (
		<>
			<WPAlignmentMatrixControl
				className={controlClassNames('alignment-matrix', className)}
				value={value}
				width={size}
				onChange={(newValue) => {
					newValue = onChange(newValue);
					setValue(newValue);
					return newValue;
				}}
			/>
		</>
	);
}

AlignmentMatrixControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current alignment value.
	 */
	value: PropTypes.string,
	/**
	 * If provided, sets the size (width and height) of the control.
	 *
	 * @default 68
	 */
	size: PropTypes.number,
};

AlignmentMatrixControl.defaultProps = {
	defaultValue: '',
	value: '',
	size: 68,
};

export { convertAlignmentMatrixCoordinates } from './utils';
