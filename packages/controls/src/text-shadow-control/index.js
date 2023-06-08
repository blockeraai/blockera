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
	x: '1px',
	y: '1px',
	blur: '1px',
	color: '',
	isVisible: true,
};

function TextShadowControl({
	attribute,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: textShadowItems } = attributes;

	return (
		<div className={controlClassNames('text-shadow', className)}>
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
					popoverLabel: __('Text Shadow', 'publisher-core'),
				}}
			/>
		</div>
	);
}

export default TextShadowControl;
