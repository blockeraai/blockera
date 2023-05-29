/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RepeaterControl from '../repeater-control';
import { controlClassNames } from '@publisher/classnames';

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

function TransitionControl({ attributes, setAttributes, className, ...props }) {
	const { Transition } = attributes;
	const updateBlockAttributes = useCallback(
		(newTransition) => {
			setAttributes({
				...attributes,
				Transition: newTransition,
			});
		},
		[attributes, setAttributes]
	);

	const InnerComponents = () => <>Hello Transition</>;

	return (
		<div className={controlClassNames('transition', className)}>
			<RepeaterControl
				label={__('Transitions', 'publisher')}
				{...{
					...props,
					initialState,
					updateBlockAttributes,
					value: Transition,
					InnerComponents,
				}}
			/>
		</div>
	);
}

export default TransitionControl;
