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
import './style.scss';

const initialState = {
	type: 'image',
	image: '',
	'image-size': 'custom',
	'image-size-width': 'auto',
	'image-size-height': 'auto',
	'image-position-top': '0%',
	'image-position-left': '0%',
	'image-repeat': 'repeat',
	'image-attachment': 'scroll',
	'linear-gradient': 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
	'linear-gradient-repeat': 'no-repeat',
	'radial-gradient': 'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
	'radial-gradient-position-top': '50%',
	'radial-gradient-position-left': '50%',
	'radial-gradient-size': 'farthest-corner',
	'radial-gradient-repeat': 'no-repeat',
	isVisible: true,
};

function BackgroundControl({
	attribute,
	//
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);
	const { [attribute]: backgroundItems } = attributes;

	return (
		<div className={controlClassNames('background', className)}>
			<RepeaterControl
				{...{
					...props,
					Header,
					initialState,
					updateBlockAttributes: (newBackgroundItems) => {
						attributes[attribute] = newBackgroundItems;

						setAttributes(attributes);
					},
					value: backgroundItems,
					InnerComponents: Fields,
					attribute,
				}}
			/>
		</div>
	);
}

export default BackgroundControl;

export { getBackgroundItemBGProperty } from './utils';
