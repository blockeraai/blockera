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
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';

export default function TransformControl({
	defaultValue = {
		type: 'move',
		'move-x': '0px',
		'move-y': '0px',
		'move-z': '0px',
		scale: '100%',
		'rotate-x': '0deg',
		'rotate-y': '0deg',
		'rotate-z': '0deg',
		'skew-x': '0deg',
		'skew-y': '0deg',
		isVisible: true,
	},
	popoverLabel = __('Transform', 'publisher-core'),
	//
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('transform', className)}
			popoverLabel={popoverLabel}
			Header={Header}
			InnerComponents={Fields}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}
