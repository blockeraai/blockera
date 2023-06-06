/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { __experimentalAlignmentMatrixControl as WPAlignmentMatrixControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { getControlValue, updateControlValue } from './../utils';
import './style.scss';

const AlignmentMatrixControl = ({
	initValue = '',
	width = 68,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
}) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		initValue,
		attributes
	);

	return (
		<WPAlignmentMatrixControl
			className={controlClassNames('alignment-matrix', className)}
			value={controlValue}
			width={width}
			onChange={(newValue) => {
				updateControlValue(
					newValue,
					attribute,
					repeaterAttribute,
					repeaterAttributeIndex,
					attributes,
					setAttributes
				);

				onChange(newValue);
			}}
		/>
	);
};

export default AlignmentMatrixControl;

export { convertAlignmentMatrixCoordinates } from './utils';
