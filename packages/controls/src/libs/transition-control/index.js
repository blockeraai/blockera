// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
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
import type { TTransitionControlProps } from './types';
import { LabelDescription } from './components/label-description';

export default function TransitionControl({
	defaultRepeaterItemValue = {
		type: 'all',
		duration: '500ms',
		timing: 'ease',
		delay: '0ms',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelDescription,
	className,
	...props
}: TTransitionControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('transition', className)}
			popoverTitle={popoverTitle || __('Transitions', 'publisher-core')}
			label={label || __('Transitions', 'publisher-core')}
			labelDescription={labelDescription || <LabelDescription />}
			addNewButtonLabel={__('Add New Transition', 'publisher-core')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}
