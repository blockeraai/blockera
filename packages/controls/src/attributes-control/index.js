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

export default function AttributesControl({
	defaultValue = {
		key: '',
		value: '',
		isVisible: true,
	},
	popoverLabel = __('HTML Attribute', 'publisher-core'),
	attributeElement = 'general',
	//
	className,
	...props
}) {
	return (
		<div className={controlClassNames('attributes', className)}>
			<RepeaterControl
				popoverLabel={popoverLabel}
				Header={Header}
				InnerComponents={Fields}
				defaultValue={defaultValue}
				attributeElement={attributeElement}
				{...props}
			/>
		</div>
	);
}
