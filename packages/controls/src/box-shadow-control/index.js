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
import RepeaterItemHeader from './components/header';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';

export default function BoxShadowControl({
	defaultRepeaterItemValue = {
		type: 'outer',
		x: '0px',
		y: '0px',
		blur: '0px',
		spread: '0px',
		color: '',
		isVisible: true,
	},
	popoverLabel = __('Box Shadow', 'publisher-core'),
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('box-shadow', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}
