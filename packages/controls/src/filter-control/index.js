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
	type: 'blur',
	blur: '3px',
	brightness: '200%',
	contrast: '200%',
	'hue-rotate': '45deg',
	saturate: '200%',
	grayscale: '100%',
	invert: '100%',
	sepia: '100%',
	'drop-shadow-x': '10px',
	'drop-shadow-y': '10px',
	'drop-shadow-blur': '10px',
	'drop-shadow-color': '',
	isVisible: true,
};

function FilterControl({
	attribute,
	popoverLabel = __('Filter Effect', 'publisher-core'),
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: filterItems } = attributes;

	return (
		<div className={controlClassNames('filter', className)}>
			<RepeaterControl
				{...{
					...props,
					popoverLabel,
					Header,
					initialState,
					updateBlockAttributes: (newFilterItems) =>
						setAttributes({
							...attributes,
							[attribute]: newFilterItems,
						}),
					value: filterItems,
					InnerComponents: Fields,
					attribute,
				}}
			/>
		</div>
	);
}

export default FilterControl;
