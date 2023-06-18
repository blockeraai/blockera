/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import Header from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';

const initialState = {
	key: '',
	value: '',
	isVisible: true,
};

function AttributesControl({
	initValue = { ...initialState },
	value,
	attribute,
	//
	className,
	attributeElement = 'general',
	onValueChange = (newValue) => {
		return newValue;
	},
	...props
}) {
	return (
		<div className={controlClassNames('attributes', className)}>
			<RepeaterControl
				{...{
					...props,
					popoverLabel: __('HTML Attribute', 'publisher-core'),
					Header,
					initialState: initValue,
					updateBlockAttributes: (newItems) =>
						onValueChange(newItems),
					value,
					InnerComponents: Fields,
					attribute,
					attributeElement,
				}}
			/>
		</div>
	);
}

export default AttributesControl;
