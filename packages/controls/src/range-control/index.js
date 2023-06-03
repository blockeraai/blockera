/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { controlClassNames } from '@publisher/classnames';
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '@publisher/extensions';

const RangeControl = ({
	min = 12,
	max = 30,
	className,
	attribute,
	initialPosition,
	withInputField = true,
	onChange = () => {},
}) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			<WordPressRangeControl
				{...{
					min,
					max,
					value: attributes[attribute] || initialPosition,
					onChange: (newValue) => {
						onChange(newValue);
						setAttributes({
							...attributes,
							[attribute]: newValue,
						});
					},
					className: controlClassNames('range', className),
				}}
				withInputField={withInputField}
				__nextHasNoMarginBottom={false}
			/>
		</>
	);
};

export default RangeControl;
