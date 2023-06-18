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

export default function OutlineControl({
	initValue = {
		width: '2px',
		style: 'solid',
		color: '#b6b6b6',
		offset: '2px',
		isVisible: true,
	},
	popoverLabel = __('Outline', 'publisher-core'),
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('outline', className)}
			popoverLabel={popoverLabel}
			Header={Header}
			InnerComponents={Fields}
			initValue={initValue}
			{...props}
		/>
	);
}
