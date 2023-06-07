/**
 * WordPress dependencies
 */
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

const RangeControl = ({
	min,
	max,
	initialPosition,
	withInputField = true,
	//
	//
	value,
	className,
	onValueChange = () => {},
}) => {
	return (
		<>
			<WordPressRangeControl
				{...{
					initialPosition,
					min,
					max,
					value,
					onChange: onValueChange,
					className: controlClassNames('range', className),
				}}
				withInputField={withInputField}
				__nextHasNoMarginBottom={false}
			/>
		</>
	);
};

export default RangeControl;
