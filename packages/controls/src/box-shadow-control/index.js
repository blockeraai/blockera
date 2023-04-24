/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import classnames from '@publisher/classnames';
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
	const updateBlockAttributes = useCallback((boxShadowItems) => {
		setAttributes({
			...attributes,
			publisherAttributes: {
				boxShadowItems,
			},
		});
	}, []);

	return (
		<InspectElement
			title={__('Box Shadow', 'publisher')}
			initialOpen={true}
		>
			<div className={classnames('control', className)}>
				<RepeaterControl
					label={__('Add Box Shadow', 'publisher')}
					{...{
						...props,
						updateBlockAttributes,
						savedItems: boxShadowItems,
						InnerComponents: BoxShadowFields,
						initialState: boxShadowItems?.length
							? boxShadowItems
							: [initialState],
					}}
				/>
			</div>
		</InspectElement>
	);
}

export default BoxShadowControl;
