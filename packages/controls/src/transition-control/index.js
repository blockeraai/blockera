/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import Header from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import { getControlValue, updateControlValue } from './../utils';

const initialState = {
	type: 'all',
	duration: '500ms',
	timing: 'ease',
	delay: '0ms',
	isVisible: true,
};

function TransitionControl({
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		'',
		attributes
	);

	return (
		<div className={controlClassNames('transition', className)}>
			<RepeaterControl
				{...{
					...props,
					Header,
					initialState,
					updateBlockAttributes: (newValue) => {
						updateControlValue(
							newValue,
							attribute,
							repeaterAttribute,
							repeaterAttributeIndex,
							attributes,
							setAttributes
						);
					},
					value: controlValue,
					InnerComponents: Fields,
				}}
			/>
		</div>
	);
}

export default TransitionControl;
