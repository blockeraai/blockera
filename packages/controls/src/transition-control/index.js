/**
 * WordPress dependencies
 */
import { useCallback, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RepeaterControl from '../repeater-control';
import { BlockEditContext } from '@publisher/extensions';
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

function TransitionControl({ attribute, className, ...props }) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
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
