/**
 * WordPress dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Render Range Control
 *
 * @param {Object} props The component properties
 * @return {Object} The JSX object
 */
const RangeControl = (props) => {
	const { className, value, onChange = () => {}, min = 12, max = 30 } = props;

	return (
		<>
			<WordPressRangeControl
				{...{
					min,
					max,
					value,
					...props,
					onChange,
					className: controlClassNames('range', className),
				}}
			/>
		</>
	);
};

export default RangeControl;
