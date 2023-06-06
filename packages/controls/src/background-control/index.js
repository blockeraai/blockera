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
import { getControlValue, updateControlValue } from '../utils';

const initialState = {
	type: 'image',
	image: '',
	'background-image-size': 'custom',
	'background-image-size-width': 'auto',
	'background-image-size-height': 'auto',
	'background-image-position-left': '0%',
	'background-image-position-top': '0%',
	'background-image-repeat': 'repeat',
	'background-image-attachment': 'scroll',
	isVisible: true,
};

function BackgroundControl({
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
		<div className={controlClassNames('background', className)}>
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

export default BackgroundControl;
