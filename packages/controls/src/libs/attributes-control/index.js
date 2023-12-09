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
import type { TAttributesControlProps } from './types';

export default function AttributesControl({
	id,
	defaultRepeaterItemValue,
	popoverTitle,
	//
	className,
	...props
}: TAttributesControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			popoverTitle={popoverTitle}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			addNewButtonLabel={__('Add New HTML Attribute', 'publisher-core')}
			// custom prop for this control
			className={controlClassNames('attributes', className)}
			{...props}
		/>
	);
}

AttributesControl.propTypes = {
	/**
	 * The control identifier
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: (PropTypes.shape({
		key: PropTypes.string,
		__key: PropTypes.string,
		value: PropTypes.string,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Label for popover
	 */
	popoverTitle: PropTypes.string,
};

AttributesControl.defaultProps = {
	defaultValue: ([]: any),
	defaultRepeaterItemValue: {
		key: '',
		__key: '',
		value: '',
		isVisible: true,
	},
	popoverTitle: (__('HTML Attribute', 'publisher-core'): any),
};
