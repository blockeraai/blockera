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
	type: 'blur',
	blur: '10px',
	brightness: '200%',
	contrast: '200%',
	'hue-rotate': '45deg',
	saturate: '200%',
	grayscale: '100%',
	invert: '100%',
	sepia: '100%',
	'drop-shadow-x': '10px',
	'drop-shadow-y': '10px',
	'drop-shadow-blur': '10px',
	'drop-shadow-color': '',
	isVisible: true,
};

function FilterControl({
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
		<div className={controlClassNames('filter', className)}>
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

export default FilterControl;
