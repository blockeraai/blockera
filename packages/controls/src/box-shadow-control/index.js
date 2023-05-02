/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Header from './components/header';
import { controlClassNames } from '@publisher/classnames';
import RepeaterControl from '../repeater-control';
import { InspectElement } from '@publisher/components';
import BoxShadowFields from './components/box-shadow-fields';

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

function BoxShadowControl({
	attributes,
	setAttributes,
	className = 'box-shadow',
	...props
}) {
	const {
		publisherAttributes: { boxShadowItems },
	} = attributes;
	const updateBlockAttributes = useCallback(
		(newBoxShadowItems) => {
			setAttributes({
				...attributes,
				publisherAttributes: {
					boxShadowItems: newBoxShadowItems,
				},
			});
		},
		[attributes, setAttributes]
	);

	return (
		<InspectElement
			title={__('Box Shadow', 'publisher')}
			initialOpen={true}
		>
			<div className={controlClassNames('control', className)}>
				<RepeaterControl
					label={__('Add Box Shadow', 'publisher')}
					{...{
						...props,
						Header,
						initialState,
						updateBlockAttributes,
						value: boxShadowItems,
						InnerComponents: BoxShadowFields,
					}}
				/>
			</div>
		</InspectElement>
	);
}

export default BoxShadowControl;
