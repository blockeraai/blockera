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

export default function FilterControl({
	defaultRepeaterItemValue = {
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
	},
	popoverLabel = __('Filter Effect', 'publisher-core'),
	//
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('filter', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}
