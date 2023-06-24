/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import Header from './components/header';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';

export default function BoxShadowControl({
	defaultValue = {
		type: 'outer',
		x: '0px',
		y: '0px',
		blur: '0px',
		spread: '0px',
		isVisible: true,
		color: '',
	},
	popoverLabel = __('Box Shadow', 'publisher-core'),
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('box-shadow', className)}
			popoverLabel={popoverLabel}
			Header={Header}
			InnerComponents={Fields}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}
