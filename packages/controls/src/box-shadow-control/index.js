/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Header from './components/header';
import RepeaterControl from '../repeater-control';
import { controlClassNames } from '@publisher/classnames';
import BoxShadowFields from './components/box-shadow-fields';

const initialState = {
	x: 10,
	y: 0,
	blur: 0,
	spread: 0,
	unit: 'px',
	inset: false,
	isVisible: true,
	color: '',
};

function BoxShadowControl({ attributes, setAttributes, className, ...props }) {
	const { publisherBoxShadowItems } = attributes;
	const updateBlockAttributes = useCallback(
		(newBoxShadowItems) => {
			setAttributes({
				...attributes,
				publisherBoxShadowItems: newBoxShadowItems,
			});
		},
		[attributes, setAttributes]
	);

	return (
		<div className={controlClassNames('box-shadow', className)}>
			<RepeaterControl
				label={__('Box Shadows', 'publisher')}
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
