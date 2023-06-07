/**
 * WordPress dependencies
 */
import { GradientPicker as WPGradientPicker } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';

const GradientBarControl = ({
	initValue = null,
	//
	value,
	//
	className,
	onValueChange = () => {},
}) => {
	return (
		<WPGradientPicker
			className={controlClassNames('select', 'native-select', className)}
			value={value || initValue}
			gradients={[]}
			clearable={false}
			onChange={onValueChange}
		/>
	);
};

export default GradientBarControl;
