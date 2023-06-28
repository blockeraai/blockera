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
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';

export default function TextShadowControl({
	defaultRepeaterItemValue = {
		x: '1px',
		y: '1px',
		blur: '1px',
		color: '',
		isVisible: true,
	},
	popoverLabel = __('Text Shadow', 'publisher-core'),
	//
	className,
	...props
}) {
	return (
		<div className={controlClassNames('text-shadow', className)}>
			<RepeaterControl
				className={controlClassNames('text-shadow', className)}
				popoverLabel={popoverLabel}
				repeaterItemHeader={RepeaterItemHeader}
				repeaterItemChildren={Fields}
				defaultRepeaterItemValue={defaultRepeaterItemValue}
				{...props}
			/>
		</div>
	);
}
