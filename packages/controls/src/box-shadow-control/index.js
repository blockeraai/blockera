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
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';

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
	attribute,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: boxShadowItems } = attributes;

	return (
		<div className={controlClassNames('box-shadow', className)}>
			<RepeaterControl
				{...{
					Header,
					...props,
					attribute,
					initialState,
					value: boxShadowItems,
					InnerComponents: Fields,
					updateBlockAttributes: (newBoxShadowItems) =>
						setAttributes({
							...attributes,
							[attribute]: newBoxShadowItems,
						}),
				}}
			/>
		</div>
	);
}

export default BoxShadowControl;
