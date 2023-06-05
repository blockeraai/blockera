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
	type: 'outer',
	x: '0px',
	y: '0px',
	blur: '0px',
	spread: '0px',
	isVisible: true,
	color: '',
};

function BoxShadowControl({
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
		<div className={controlClassNames('box-shadow', className)}>
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
					attribute,
				}}
			/>
		</div>
	);
}

export default BoxShadowControl;
