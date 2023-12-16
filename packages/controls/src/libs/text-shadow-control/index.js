// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
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
import type { TTextShadowControlProps } from './types';

export default function TextShadowControl({
	defaultRepeaterItemValue = {
		x: '1px',
		y: '1px',
		blur: '1px',
		color: '',
		isVisible: true,
	},
	popoverTitle = __('Text Shadow', 'publisher-core'),
	className,
	...props
}: TTextShadowControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('text-shadow', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Text Shadow', 'publisher-core')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}

TextShadowControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * The current value.
	 */
	value: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	// $FlowFixMe
	defaultRepeaterItemValue: PropTypes.shape({
		x: PropTypes.string,
		y: PropTypes.string,
		blur: PropTypes.string,
		color: PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverTitle: PropTypes.string,
};
