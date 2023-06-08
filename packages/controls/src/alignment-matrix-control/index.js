/**
 * WordPress dependencies
 */
import { __experimentalAlignmentMatrixControl as WPAlignmentMatrixControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';

const AlignmentMatrixControl = ({
	initValue = '',
	width = 68,
	//
	value,
	//
	className,
	onChange = () => {},
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	return (
		<WPAlignmentMatrixControl
			className={controlClassNames('alignment-matrix', className)}
			value={value || initValue}
			width={width}
			onChange={(newValue) => {
				onChange(newValue);
				onValueChange(newValue);
				return newValue;
			}}
		/>
	);
};

export default AlignmentMatrixControl;

export { convertAlignmentMatrixCoordinates } from './utils';
