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

const initialState = {
	type: 'all',
	duration: '500ms',
	timing: 'ease',
	delay: '0ms',
	isVisible: true,
};

function TransitionControl({
	attribute,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: transitionItems } = attributes;

	return (
		<div className={controlClassNames('transition', className)}>
			<RepeaterControl
				{...{
					...props,
					Header,
					initialState,
					updateBlockAttributes: (newTransitionItems) => {
						attributes[attribute] = newTransitionItems;

						setAttributes(attributes);
					},
					value: transitionItems,
					InnerComponents: Fields,
					attribute,
				}}
			/>
		</div>
	);
}

export default TransitionControl;
