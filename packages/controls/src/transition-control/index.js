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

export default function TransitionControl({
	defaultValue = {
		type: 'all',
		duration: '500ms',
		timing: 'ease',
		delay: '0ms',
		isVisible: true,
	},
	popoverLabel = __('Transition', 'publisher-core'),
	//
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('transition', className)}
			popoverLabel={popoverLabel}
			Header={Header}
			InnerComponents={Fields}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}
