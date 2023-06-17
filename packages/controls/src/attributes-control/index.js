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
	key: '',
	value: '',
	isVisible: true,
};

function AttributesControl({
	attribute,
	//
	className,
	attributeElement = 'general',
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: attributesItems } = attributes;

	return (
		<div className={controlClassNames('attributes', className)}>
			<RepeaterControl
				{...{
					...props,
					popoverLabel: __('HTML Attribute', 'publisher-core'),
					Header,
					initialState,
					updateBlockAttributes: (newItems) =>
						setAttributes({
							...attributes,
							[attribute]: newItems,
						}),
					value: attributesItems,
					InnerComponents: Fields,
					attribute,
					attributeElement,
				}}
			/>
		</div>
	);
}

export default AttributesControl;
