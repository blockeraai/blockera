/**
 * WordPress dependencies
 */
import { useCallback, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Header from './components/header';
import RepeaterControl from '../repeater-control';
import { BlockEditContext } from '@publisher/extensions';
import { controlClassNames } from '@publisher/classnames';
import BoxShadowFields from './components/box-shadow-fields';

const initialState = {
	type: 'outside',
	angle: 0,
	x: 0,
	y: 0,
	blur: 0,
	spread: 0,
	unit: 'px',
	inset: false,
	isVisible: true,
	color: '',
};

function BoxShadowControl({ attribute, className, ...props }) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { publisherBoxShadowItems } = attributes;
	const updateBlockAttributes = useCallback(
		(newBoxShadowItems) => {
			setAttributes({
				...attributes,
				[attribute]: newBoxShadowItems,
			});
		},
		[attributes, setAttributes]
	);

	return (
		<div className={controlClassNames('box-shadow', className)}>
			<RepeaterControl
				{...{
					...props,
					Header,
					initialState,
					updateBlockAttributes,
					value: publisherBoxShadowItems,
					InnerComponents: BoxShadowFields,
				}}
			/>
		</div>
	);
}

export default BoxShadowControl;
