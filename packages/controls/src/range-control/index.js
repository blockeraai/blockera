/**
 * WordPress dependencies
 */
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Render Range Control
 *
 * @param {Object} props The component properties
 * @return {Object} The JSX object
 */
const RangeControl = (props) => {
	const {
		className = 'range-control',
		value,
		onChange = () => {},
		min = 12,
		max = 30,
	} = props;

	return (
		<>
			<WordPressRangeControl
				{...{
					min,
					max,
					value,
					...props,
					onChange,
					className,
				}}
			/>
		</>
	);
};

export default RangeControl;
