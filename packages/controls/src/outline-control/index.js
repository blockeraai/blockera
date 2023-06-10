/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
	width: '2',
	style: 'solid',
	color: '#B6B6B6',
	offset: '2px',
	isVisible: true,
};

function OutlineControl({
	attribute,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: textShadowItems } = attributes;

	return (
		<div className={controlClassNames('outline', className)}>
			<RepeaterControl
				{...{
					...props,
					Header,
					attribute,
					initialState,
					updateBlockAttributes: (textShadowItems) => {
						setAttributes({
							...attributes,
							[attribute]: textShadowItems,
						});
					},
					value: textShadowItems,
					InnerComponents: Fields,
					popoverLabel: __('Outline', 'publisher-core'),
				}}
			/>
		</div>
	);
}

export default OutlineControl;
