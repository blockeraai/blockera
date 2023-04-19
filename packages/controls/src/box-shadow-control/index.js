/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RepeaterControl from '../repeater-control';
import BoxShadowItems from './components/items';

/**
 * Css dependencies
 */
import './style.scss';

function BoxShadowControl(props) {
	return (
		<RepeaterControl
			{...props}
			initialState={{
				x: 0,
				y: 0,
				blur: 0,
				spread: 0,
				unit: 'px',
				inset: false,
				color: 'transparent',
				isPanelOpen: false,
			}}
			name="boxShadowItems"
			InnerComponents={BoxShadowItems}
			title={__('Box Shadow', 'publisher')}
			label={__('Add Box Shadow', 'publisher')}
		/>
	);
}

export default BoxShadowControl;
