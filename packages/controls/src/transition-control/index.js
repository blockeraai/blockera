/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import RepeaterControl from '../repeater-control';
import { getControlValue, updateControlValue } from './../utils';

const initialState = {
	x: 0,
	y: 0,
	blur: 0,
	spread: 0,
	unit: 'px',
	inset: false,
	isVisible: true,
	color: 'transparent',
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

	const InnerComponents = () => <>Hello Transition</>;

	return (
		<div className={controlClassNames('transition', className)}>
			<RepeaterControl
				{...{
					...props,
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
					InnerComponents,
				}}
			/>
		</div>
	);
}

export default TransitionControl;
